import io
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

def generate_pdf_report(user_name: str, assessment, predictions_with_recs) -> io.BytesIO:
    buffer = io.BytesIO()
    
    # Page setup
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=54,
        leftMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    
    styles = getSampleStyleSheet()
    
    # Custom Paragraph Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        textColor=colors.HexColor('#1e293b'), # slate-800
        spaceAfter=15
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        textColor=colors.HexColor('#64748b'), # slate-500
        spaceAfter=25
    )
    
    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        textColor=colors.HexColor('#0f766e'), # teal-700
        spaceBefore=15,
        spaceAfter=10
    )
    
    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        textColor=colors.HexColor('#334155'), # slate-700
        leading=14
    )
    
    bullet_style = ParagraphStyle(
        'DocBullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        textColor=colors.HexColor('#475569'), # slate-600
        leading=13,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=5
    )
    
    disclaimer_style = ParagraphStyle(
        'Disclaimer',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8,
        textColor=colors.HexColor('#94a3b8'), # slate-400
        leading=11,
        alignment=1 # Centered
    )

    story = []
    
    # 1. Header
    story.append(Paragraph("BioSentra AI", title_style))
    story.append(Paragraph(f"Personalized Health Screening & Preventive Report &bull; Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", subtitle_style))
    story.append(Spacer(1, 10))
    
    # 2. Patient Demographics & Vitals Table
    story.append(Paragraph("Patient Demographics & Vitals Summary", section_heading))
    
    gender_str = "Female" if assessment.gender == 1 else "Male"
    bmi_status = "Underweight"
    if 18.5 <= assessment.bmi < 25:
        bmi_status = "Normal Weight"
    elif 25 <= assessment.bmi < 30:
        bmi_status = "Overweight"
    elif assessment.bmi >= 30:
        bmi_status = "Obese"
        
    vitals_data = [
        [Paragraph("<b>Patient Name:</b>", body_style), Paragraph(user_name, body_style), 
         Paragraph("<b>Date of Assessment:</b>", body_style), Paragraph(assessment.created_at.strftime('%Y-%m-%d'), body_style)],
        [Paragraph("<b>Age:</b>", body_style), Paragraph(f"{assessment.age} years", body_style), 
         Paragraph("<b>Gender:</b>", body_style), Paragraph(gender_str, body_style)],
        [Paragraph("<b>Height:</b>", body_style), Paragraph(f"{assessment.height} cm", body_style), 
         Paragraph("<b>Weight:</b>", body_style), Paragraph(f"{assessment.weight} kg", body_style)],
        [Paragraph("<b>BMI:</b>", body_style), Paragraph(f"{assessment.bmi:.1f} ({bmi_status})", body_style), 
         Paragraph("<b>Blood Pressure:</b>", body_style), Paragraph(f"{assessment.systolic_bp}/{assessment.diastolic_bp} mmHg", body_style)],
        [Paragraph("<b>Glucose level:</b>", body_style), Paragraph(f"{assessment.glucose} mg/dL", body_style), 
         Paragraph("<b>Smoking Habit:</b>", body_style), Paragraph("Yes" if assessment.smoke == 1 else "No", body_style)]
    ]
    
    vitals_table = Table(vitals_data, colWidths=[1.5*inch, 2.0*inch, 1.5*inch, 2.0*inch])
    vitals_table.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('LINEBELOW', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')), # light border
    ]))
    
    story.append(vitals_table)
    story.append(Spacer(1, 20))
    
    # 3. Screening Results Table
    story.append(Paragraph("AI Disease Screening & Risk Levels", section_heading))
    
    # Table headers
    screening_data = [[
        Paragraph("<b>Target Disease</b>", body_style),
        Paragraph("<b>Risk Probability</b>", body_style),
        Paragraph("<b>Risk Level</b>", body_style)
    ]]
    
    for pred in predictions_with_recs:
        color_hex = '#10b981' # Green (Low)
        if pred["risk_level"] == "High":
            color_hex = '#ef4444' # Red (High)
        elif pred["risk_level"] == "Moderate":
            color_hex = '#f59e0b' # Amber (Moderate)
            
        prob_para = Paragraph(f"{pred['probability']:.1f}%", body_style)
        risk_para = Paragraph(f"<font color='{color_hex}'><b>{pred['risk_level']}</b></font>", body_style)
        
        screening_data.append([
            Paragraph(pred["disease"], body_style),
            prob_para,
            risk_para
        ])
        
    screening_table = Table(screening_data, colWidths=[3.0*inch, 2.0*inch, 2.0*inch])
    screening_table.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#f8fafc')), # slate-50
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')), # border
    ]))
    
    story.append(screening_table)
    story.append(Spacer(1, 25))
    
    # Move recommendations to page 2 if needed
    story.append(PageBreak())
    
    # 4. Detailed AI Recommendations
    story.append(Paragraph("Personalized Preventative Action Plan", section_heading))
    story.append(Paragraph("Based on your biomarkers and health profile, the BioSentra AI engine recommends the following preventative measures:", body_style))
    story.append(Spacer(1, 10))
    
    for pred in predictions_with_recs:
        recs = pred["recommendations"]
        if not recs:
            continue
            
        story.append(Paragraph(f"<b>{pred['disease']} Risk Mitigation:</b>", ParagraphStyle('Sub', parent=body_style, fontName='Helvetica-Bold', textColor=colors.HexColor('#0f766e'), spaceBefore=10, spaceAfter=5)))
        for rec in recs:
            story.append(Paragraph(f"&bull; {rec}", bullet_style))
        story.append(Spacer(1, 8))
        
    story.append(Spacer(1, 30))
    
    # 5. Disclaimer Footer
    story.append(Paragraph("<b>MEDICAL DISCLAIMER</b>", ParagraphStyle('DiscTitle', parent=disclaimer_style, fontName='Helvetica-Bold', spaceAfter=5)))
    story.append(Paragraph(
        "This BioSentra AI Health Screening Report is generated for screening, educational, and lifestyle informational purposes only. "
        "It is powered by machine learning algorithms that estimate statistical risks based on general population data. "
        "THIS REPORT DOES NOT CONSTITUTE MEDICAL ADVICE, DIAGNOSIS, OR CLINICAL TREATMENT. The values shown here are not definitive diagnostic results. "
        "Please consult a certified general physician or specialist to interpret these results and receive proper clinical diagnosis, tests, or treatment.",
        disclaimer_style
    ))
    
    # Build Document
    doc.build(story)
    buffer.seek(0)
    return buffer
