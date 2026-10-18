import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score

# Ensure models directory exists
os.makedirs("models", exist_ok=True)

# List of models to evaluate
def get_models():
    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
        "Gradient Boosting": GradientBoostingClassifier(random_state=42)
    }
    # Check if xgboost is installed, if so, evaluate it
    try:
        from xgboost import XGBClassifier
        models["XGBoost"] = XGBClassifier(use_label_encoder=False, eval_metric="logloss", random_state=42)
        print("XGBoost is available and will be evaluated.")
    except ImportError:
        pass
    return models

def evaluate_and_train(dataset_path, target_col, save_path, name):
    print(f"\n--- Training {name} Model ---")
    if not os.path.exists(dataset_path):
        raise FileNotFoundError(f"Dataset {dataset_path} not found. Please run generate_datasets.py first.")
        
    df = pd.read_csv(dataset_path)
    X = df.drop(columns=[target_col])
    y = df[target_col]
    
    # Feature names
    feature_names = list(X.columns)
    print(f"Features: {feature_names}")
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    best_model_name = None
    best_pipeline = None
    best_f1 = -1
    best_metrics = {}
    
    models = get_models()
    
    for model_name, model in models.items():
        # Define Pipeline: Impute -> Scale -> Classify
        pipeline = Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
            ("classifier", model)
        ])
        
        pipeline.fit(X_train, y_train)
        y_pred = pipeline.predict(X_test)
        y_prob = pipeline.predict_proba(X_test)[:, 1] if hasattr(pipeline, "predict_proba") else y_pred
        
        # Calculate Metrics
        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, zero_division=0)
        rec = recall_score(y_test, y_pred, zero_division=0)
        f1 = f1_score(y_test, y_pred, zero_division=0)
        auc = roc_auc_score(y_test, y_prob)
        
        print(f"{model_name} - Acc: {acc:.4f}, Prec: {prec:.4f}, Rec: {rec:.4f}, F1: {f1:.4f}, AUC: {auc:.4f}")
        
        # We select the best model based on F1 Score since screening cares about balancing precision/recall
        if f1 > best_f1:
            best_f1 = f1
            best_model_name = model_name
            best_pipeline = pipeline
            best_metrics = {
                "Accuracy": acc,
                "Precision": prec,
                "Recall": rec,
                "F1": f1,
                "AUC": auc
            }
            
    print(f"Selected Best Model: {best_model_name}")
    print(f"Best Metrics: {best_metrics}")
    
    # Save the pipeline and the features metadata
    payload = {
        "pipeline": best_pipeline,
        "features": feature_names,
        "metrics": best_metrics,
        "model_name": best_model_name
    }
    joblib.dump(payload, save_path)
    print(f"Saved model pipeline payload to {save_path}")

if __name__ == "__main__":
    evaluate_and_train(
        dataset_path="datasets/diabetes_data.csv",
        target_col="Outcome",
        save_path="models/diabetes.pkl",
        name="Diabetes"
    )
    
    evaluate_and_train(
        dataset_path="datasets/cardio_data.csv",
        target_col="cardio",
        save_path="models/heart.pkl",
        name="Cardiovascular"
    )
    
    evaluate_and_train(
        dataset_path="datasets/kidney_data.csv",
        target_col="class",
        save_path="models/kidney.pkl",
        name="Chronic Kidney Disease"
    )
    
    evaluate_and_train(
        dataset_path="datasets/anemia_data.csv",
        target_col="Result",
        save_path="models/anemia.pkl",
        name="Anaemia"
    )
    
    evaluate_and_train(
        dataset_path="datasets/hypertension_data.csv",
        target_col="Outcome",
        save_path="models/hypertension.pkl",
        name="Hypertension"
    )
    print("\nAll models trained and saved successfully!")
