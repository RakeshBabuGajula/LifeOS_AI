from typing import List, Dict

class CareerEngine:
    @staticmethod
    def generate(skills: List[str], interest: str, level: str, target_role: str) -> Dict:
        """
        Generates a career roadmap based on inputs.
        This is a rule-based engine that simulates AI recommendations.
        """
        
        # Normalize inputs
        target = target_role.lower()
        current_skills = [s.lower() for s in skills]
        user_level = level.lower()
        
        # 1. Determine Skill Gaps based on Target Role
        required_skills = {
            "ai engineer": ["python", "pytorch", "tensorflow", "transformers", "langchain", "docker", "fastapi"],
            "data scientist": ["python", "pandas", "scikit-learn", "sql", "statistics", "matplotlib", "tableau"],
            "mlops engineer": ["python", "docker", "kubernetes", "mlflow", "ci/cd", "aws", "terraform"],
            "full stack ai": ["python", "react", "next.js", "typescript", "fastapi", "mongodb", "vector db"]
        }
        
        # Default to AI Engineer if not found
        target_skills = required_skills.get(target, required_skills["ai engineer"])
        
        # Calculate gaps
        gaps = [s for s in target_skills if s not in current_skills]
        if not gaps:
            gaps = ["Advanced System Design", "Optimization", "Leadership"]
            
        # 2. Determine Timeline based on level and gaps
        base_months = 3
        if user_level == "beginner":
            base_months = 12
        elif user_level == "intermediate": 
            base_months = 6
            
        timeline = max(3, base_months + len(gaps))
        
        # 3. Generate Next Steps
        steps = []
        if "python" in gaps:
            steps.append("Master Python Fundamentals (Data Structures, OOP)")
        if "pytorch" in gaps or "tensorflow" in gaps:
            steps.append("Deep Learning Specialization (Neural Networks, CNNs, RNNs)")
        if "langchain" in gaps:
            steps.append("Build LLM Applications with LangChain & OpenAI/HuggingFace")
        if "docker" in gaps:
            steps.append("Learn Containerization and Deployment strategies")
        
        # Fill with generic steps if empty
        if len(steps) < 3:
            steps.append(f"Build end-to-end {target_role} capstone project")
            steps.append("Contribute to Open Source AI projects")
            
        # 4. Suggested Projects
        projects = []
        if "ai engineer" in target:
            projects = ["RAG Chatbot for PDF documents", "Fine-tune Llama 3 on custom dataset"]
        elif "data scientist" in target:
            projects = ["Customer Churn Prediction Dashboard", "Stock Market Time Series Analysis"]
        elif "mlops" in target:
            projects = ["Automated Model Training Pipeline", "Real-time Model Serving Infrastructure"]
        else:
            projects = ["AI-Powered Personal Assistant with Voice", "SaaS Boilerplate with AI Features"]
            
        return {
            "career_path": f"Certified {target_role.title()}",
            "skill_gaps": [g.title() for g in gaps[:5]], # Top 5 gaps
            "next_steps": steps[:3],
            "suggested_projects": projects[:2],
            "timeline_months": timeline
        }
