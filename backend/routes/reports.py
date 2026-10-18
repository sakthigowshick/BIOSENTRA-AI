from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.database import get_db
from backend import models, schemas
from backend.routes.auth import get_current_user, get_current_user_optional
from backend.services.pdf_generator import generate_pdf_report

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("", response_model=List[schemas.AssessmentResponse])
def get_reports(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """
    List past health assessments for the authenticated user, ordered by date.
    """
    reports = db.query(models.Assessment)\
                .filter(models.Assessment.user_id == current_user.id)\
                .order_by(models.Assessment.created_at.desc())\
                .all()
    return reports

@router.get("/{report_id}", response_model=schemas.ReportDetailsResponse)
def get_report_details(
    report_id: int, 
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_user_optional)
):
    """
    Retrieve specific assessment details, including disease predictions and recommendations.
    """
    assessment = db.query(models.Assessment).filter(models.Assessment.id == report_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment report not found")
        
    # Security check: if assessment belongs to a user, only that user can view it
    if assessment.user_id is not None:
        if not current_user or assessment.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to view this report"
            )
            
    # Format predictions with their recommendations
    predictions_with_recs = []
    for pred in assessment.predictions:
        recs = [r.recommendation_text for r in pred.recommendations]
        predictions_with_recs.append({
            "disease": pred.disease,
            "probability": pred.probability,
            "risk_level": pred.risk_level,
            "recommendations": recs
        })
        
    return {
        "assessment": assessment,
        "predictions": predictions_with_recs
    }

@router.get("/{report_id}/pdf")
def download_pdf_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_user_optional)
):
    """
    Generate and download a beautifully formatted PDF report for an assessment.
    """
    assessment = db.query(models.Assessment).filter(models.Assessment.id == report_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment report not found")
        
    # Security check
    if assessment.user_id is not None:
        if not current_user or assessment.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to download this report"
            )
            
    user_name = current_user.name if current_user else "Guest Patient"
    
    # Format prediction list for PDF generator
    predictions_with_recs = []
    for pred in assessment.predictions:
        recs = [r.recommendation_text for r in pred.recommendations]
        predictions_with_recs.append({
            "disease": pred.disease,
            "probability": pred.probability,
            "risk_level": pred.risk_level,
            "recommendations": recs
        })
        
    pdf_buffer = generate_pdf_report(user_name, assessment, predictions_with_recs)
    
    filename = f"biosentra_health_report_{report_id}.pdf"
    
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename={filename}",
            "Access-Control-Expose-Headers": "Content-Disposition"
        }
    )
