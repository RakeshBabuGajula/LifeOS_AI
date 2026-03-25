from typing import List, Dict
import random

class SkillGapEngine:
    @staticmethod
    def analyze(skills: List[str], target_role: str, level: str) -> Dict:
        """
        Analyzes the gap between current skills and target role requirements.
        Uses a rule-based engine to generate insights.
        """
        
        # Normalize inputs
        current_skills = {s.lower().strip() for s in skills}
        role_key = target_role.lower()
        user_level = level.lower()
        
        # 1. Define Skills Database (The "Knowledge Base")
        role_requirements = {
            "ai/ml engineer": {
                "core": ["python", "pytorch", "tensorflow", "scikit-learn", "numpy", "pandas"],
                "advanced": ["transformers", "langchain", "huggingface", "opencv", "cuda"],
                "deployment": ["docker", "fastapi", "aws", "kubernetes", "mlflow"]
            },
            "data scientist": {
                "core": ["python", "sql", "pandas", "numpy", "matplotlib", "seaborn"],
                "advanced": ["scikit-learn", "statistics", "tableau", "powerbi", "ab testing"],
                "deployment": ["airflow", "flask", "streamlit"]
            },
            "mlops engineer": {
                "core": ["python", "docker", "kubernetes", "linux", "git"],
                "advanced": ["terraform", "jenkins", "github actions", "mlflow", "kubeflow"],
                "deployment": ["aws", "azure", "gcp", "prometheus", "grafana"]
            },
            "full stack developer": {
                "core": ["javascript", "typescript", "react", "node.js", "html", "css"],
                "advanced": ["next.js", "redux", "graphql", "tailwind css"],
                "deployment": ["vercel", "docker", "aws", "ci/cd"]
            },
            "product ai engineer": {
                "core": ["python", "javascript", "openai api", "prompt engineering"],
                "advanced": ["langchain", "vector databases", "pinecone", "weaviate"],
                "deployment": ["fastapi", "next.js", "vercel"]
            }
        }
        
        # Default fallback
        reqs = role_requirements.get(role_key, role_requirements["ai/ml engineer"])
        all_required = reqs["core"] + reqs["advanced"] + reqs["deployment"]
        
        # 2. Calculate Skill Gaps
        missing_core = [s for s in reqs["core"] if s not in current_skills]
        missing_advanced = [s for s in reqs["advanced"] if s not in current_skills]
        missing_deployment = [s for s in reqs["deployment"] if s not in current_skills]
        
        all_missing = missing_core + missing_advanced + missing_deployment
        
        # 3. Calculate Readiness Score
        total_skills_count = len(all_required)
        matched_skills_count = len([s for s in all_required if s in current_skills])
        
        # Base score logic
        base_score = int((matched_skills_count / total_skills_count) * 100)
        
        # Adjust score based on level
        if user_level == "beginner":
            # Beginners get a curve
            base_score = min(100, int(base_score * 1.2))
        elif user_level == "advanced":
            # Harder for advanced
            base_score = int(base_score * 0.9)
            
        readiness_score = max(5, min(99, base_score)) # Clamp between 5 and 99
        
        # 4. Generate Learning Steps
        steps = []
        if missing_core:
            steps.append(f"Master Core Fundamentals: {', '.join([s.title() for s in missing_core[:3]])}")
        if missing_deployment:
            steps.append(f"Learn Deployment & DevOps: {', '.join([s.title() for s in missing_deployment[:2]])}")
        if missing_advanced:
            steps.append(f"Advance your specialized stack: {', '.join([s.title() for s in missing_advanced[:3]])}")
            
        if not steps:
            steps = ["Review advanced architecture patterns", "Contribute to open source projects", "Mentor junior developers"]

        # 5. Generate Projects
        projects_db = {
            "ai/ml engineer": [
                "Build a RAG Chatbot using LangChain & Pinecone",
                "Fine-tune Llama-3 on a custom dataset",
                "Deploy a Sentiment Analysis API with FastAPI & Docker"
            ],
            "data scientist": [
                "Customer Churn Prediction Dashboard with Streamlit",
                "Stock Market Forecasting using LSTM models",
                "E-commerce Recommendation System"
            ],
            "mlops engineer": [
                "End-to-End ML Pipeline with MLflow & Kubernetes",
                "Automated Model Retraining System with Airflow",
                "Real-time Model Monitoring Dashboard with Grafana"
            ],
            "full stack developer": [
                "AI-Powered Task Manager with Next.js & OpenAI",
                "Real-time Collaboration Tool using WebSockets",
                "E-commerce Platform with Stripe Integration"
            ],
            "product ai engineer": [
                "SaaS Boilerplate with AI Features (Auth, Stripe, AI)",
                "Personal AI Assistant with Voice Interface",
                "Smart Document Analyzer using OCR & LLMs"
            ]
        }
        
        role_projects = projects_db.get(role_key, projects_db["ai/ml engineer"])
        # Simple selection for now, could be smarter based on missing skills
        recommended_projects = role_projects[:2]
        
        # 6. Estimate Time
        # Rough heuristic: 1 month for every 2 missing skills
        time_months = max(1, (len(all_missing) // 2))
        if user_level == "beginner":
            time_months += 2
            
        return {
            "job_readiness_score": readiness_score,
            "missing_skills": [s.title() for s in all_missing[:8]], # Top 8 missing
            "priority_learning_steps": steps,
            "recommended_projects": recommended_projects,
            "estimated_time_months": time_months
        }
