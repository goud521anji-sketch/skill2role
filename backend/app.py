from flask import Flask, jsonify, request
from flask_cors import CORS

from flask_cors import CORS

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

# --- In-Memory Storage ---
USERS = {}  # email -> {password, name, id}
SESSIONS = {} # token -> user_id

# --- Constants & Mock Data ---

# Enhanced Mock Data (Jobs)
JOBS = [
    {
        "id": 1,
        "title": "Data Scientist",
        "skills": ["Python", "Machine Learning", "Statistics"],
        "min_education": "Undergraduate",
        "field": "Technology",
        "salary": 120000,
        "risk_level": "Moderate",
        "pace": "Balanced", 
        "growth_score": 9
    },
    {
        "id": 2,
        "title": "Frontend Developer",
        "skills": ["React", "JavaScript", "CSS", "Figma"],
        "min_education": "Diploma",
        "field": "Technology",
        "salary": 90000,
        "risk_level": "Low",
        "pace": "Fast-paced",
        "growth_score": 8
    },
    {
        "id": 3,
        "title": "UX Designer",
        "skills": ["Design", "Figma", "Prototyping", "User Research"],
        "min_education": "Undergraduate",
        "field": "Design",
        "salary": 95000,
        "risk_level": "Low", 
        "pace": "Balanced",
        "growth_score": 7
    },
    {
        "id": 4,
        "title": "Healthcare Administrator",
        "skills": ["Management", "Communication", "Healthcare", "Operations"],
        "min_education": "Postgraduate",
        "field": "Healthcare",
        "salary": 85000,
        "risk_level": "Stable",
        "pace": "Slow & Steady",
        "growth_score": 6
    },
    {
        "id": 5,
        "title": "Investment Banker",
        "skills": ["Finance", "Analysis", "Excel", "Communication"],
        "min_education": "Postgraduate",
        "field": "Business",
        "salary": 150000,
        "risk_level": "High Risk",
        "pace": "Fast-paced",
        "growth_score": 10
    }
]

SIMULATION_QUESTIONS = {
    1: [ # Data Scientist
        {"id": "q1", "text": "Do you enjoy working with statistics and probability?", "type": "slider", "min": 0, "max": 10},
        {"id": "q2", "text": "How comfortable are you with cleaning messy data sets?", "type": "choice", "options": ["Love it", "It's okay", "Hate it"]},
        {"id": "q3", "text": "Can you explain complex findings to non-technical people?", "type": "slider", "min": 0, "max": 10}
    ],
    2: [ # Frontend Dev
        {"id": "q1", "text": "Do you care about pixel-perfect designs?", "type": "slider", "min": 0, "max": 10},
        {"id": "q2", "text": "How do you handle debugging cross-browser issues?", "type": "choice", "options": ["Methodical", "Frustrated", "Google it"]},
        {"id": "q3", "text": "Do you enjoy learning new frameworks frequently?", "type": "slider", "min": 0, "max": 10}
    ],
    3: [ # UX Designer
        {"id": "q1", "text": "Do you enjoy conducting user interviews?", "type": "slider", "min": 0, "max": 10},
        {"id": "q2", "text": "How important is empathy in design to you?", "type": "slider", "min": 0, "max": 10},
        {"id": "q3", "text": "Prefer sketching wireframes or high-fidelity UI?", "type": "choice", "options": ["Wireframes", "High-Fi", "Both"]}
    ]
    # Add others as needed
}

# Mock data for detailed comparison
JOB_DETAILS = {
    1: {
        "work_time": "40-50 hrs/week",
        "work_type": "Hybrid",
        "benefits": ["Health Insurance", "Stock Options", "Remote Work"],
        "work_life_balance": "Moderate",
        "progression": "Fast (Senior DS -> Lead -> AI Director)",
        "why_best": "Best for High Growth & Innovation"
    },
    2: {
        "work_time": "35-40 hrs/week",
        "work_type": "Remote Possible",
        "benefits": ["Flexible Hours", "Learning Budget", "Gym"],
        "work_life_balance": "Good",
        "progression": "Steady (Senior Dev -> Tech Lead -> Architect)",
        "why_best": "Best for Work-Life Balance"
    },
    3: {
        "work_time": "40-45 hrs/week",
        "work_type": "Hybrid",
        "benefits": ["Creative Environment", "Health", "Bonuses"],
        "work_life_balance": "Good",
        "progression": "Moderate (Senior UX -> Product Designer -> Head of Design)",
        "why_best": "Best for Creativity"
    },
    4: {
        "work_time": "40 hrs/week",
        "work_type": "On-site",
        "benefits": ["Pension", "Stable Job", "Healthcare"],
        "work_life_balance": "Excellent",
        "progression": "Slow but Stable",
        "why_best": "Lowest Risk Option"
    },
    5: {
        "work_time": "60-80 hrs/week",
        "work_type": "On-site",
        "benefits": ["Huge Bonuses", "Prestige", "Networking"],
        "work_life_balance": "Poor",
        "progression": "Very Fast (Associate -> VP -> MD)",
        "why_best": "Best for High Salary"
    }
}

# --- Auth Routes ---

@app.route('/auth/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    full_name = data.get('fullName', 'User')

    if email in USERS:
        return jsonify({"error": "User already exists"}), 400
    
    import uuid
    user_id = str(uuid.uuid4())
    USERS[email] = {
        "id": user_id,
        "email": email,
        "password": password,
        "name": full_name
    }
    
    # Auto-login
    token = str(uuid.uuid4())
    SESSIONS[token] = user_id
    
    return jsonify({"token": token, "user": {"name": full_name, "email": email}}), 200

@app.route('/auth/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    user = USERS.get(email)
    if not user or user['password'] != password:
        return jsonify({"error": "Invalid credentials"}), 401
        
    import uuid
    token = str(uuid.uuid4())
    SESSIONS[token] = user['id']
    
    return jsonify({"token": token, "user": {"name": user['name'], "email": email}}), 200

@app.route('/auth/guest', methods=['POST'])
def guest_login():
    import uuid
    token = "guest_" + str(uuid.uuid4())
    user_id = "guest_user"
    SESSIONS[token] = user_id
    return jsonify({"token": token, "user": {"name": "Guest", "email": "guest@example.com"}}), 200


# --- Profile Routes ---

@app.route('/api/user-profile', methods=['POST'])
def save_profile():
    data = request.json
    print("Received Profile:", data)
    return jsonify({"status": "success", "message": "Profile saved"}), 200

@app.route('/api/job-match', methods=['POST'])
def match_jobs():
    profile = request.json
    
    # Extract User Data
    user_skills = {s['name'].lower(): s['proficiency'] for s in profile.get('skills', [])}
    user_education = profile.get('education', {}).get('level', '')
    user_interests = set(profile.get('interests', [])) 
    user_domains = set(s.get('domain') for s in profile.get('skills', []) if s.get('domain'))
    
    behavioral = profile.get('behavioral', {})
    user_pace = behavioral.get('pace', 'Balanced')
    user_risk = behavioral.get('risk', 'Moderate')

    matches = []
    
    for job in JOBS:
        score = 0
        
        # 1. Skill Matching (Weighted) - 40%
        job_skills = set(s.lower() for s in job['skills'])
        user_skill_names = set(user_skills.keys())
        overlap = job_skills.intersection(user_skill_names)
        
        if job_skills:
            skill_score = 0
            for skill in overlap:
                proficiency = user_skills.get(skill, 3) # default 3
                skill_score += 1 + (proficiency * 0.2)
                
            raw_skill_match = len(overlap) / len(job_skills)
            score += raw_skill_match * 40
            
            score += (skill_score / (len(job_skills) * 2)) * 10
        
        # 2. Domain/Interest Match - 20%
        if job['field'] in user_domains:
            score += 20
            
        # 3. Behavioral Fit - 20%
        if job['pace'] == user_pace:
            score += 10
        elif (user_pace == 'Balanced') or (job['pace'] == 'Balanced'):
             score += 5
             
        risk_map = {'Stable': 1, 'Low': 2, 'Moderate': 3, 'High Risk': 4}
        job_risk_val = risk_map.get(job['risk_level'], 2)
        user_risk_val = risk_map.get(user_risk, 2)
        
        if abs(job_risk_val - user_risk_val) <= 1:
            score += 10
        else:
            score -= 5 
            
        # 4. Education Filter
        edu_levels = {'Secondary': 1, 'Diploma': 2, 'Undergraduate': 3, 'Postgraduate': 4, 'Doctorate': 5}
        job_min_edu = edu_levels.get(job['min_education'], 1)
        user_edu_val = edu_levels.get(user_education, 0)
        
        if user_edu_val >= job_min_edu:
            score += 20
        else:
            score -= 10 
            
        final_score = min(max(score, 0), 100)
        
        matches.append({
            "job": job,
            "match_score": final_score,
            "missing_skills": list(job_skills - user_skill_names)
        })
    
    matches.sort(key=lambda x: x['match_score'], reverse=True)
    return jsonify(matches), 200

@app.route('/api/compare-careers', methods=['POST'])
def compare_careers():
    # Expects list of job_ids
    data = request.json
    job_ids = data.get('job_ids', [])
    
    comparison_data = []
    for job in JOBS:
        if job['id'] in job_ids:
            details = JOB_DETAILS.get(job['id'], {})
            # Merge basic job info with details
            full_info = {**job, **details}
            comparison_data.append(full_info)
            
    return jsonify(comparison_data), 200

# --- Simulation Routes ---

@app.route('/simulation/questions/<int:job_id>', methods=['GET'])
def get_simulation_questions(job_id):
    questions = SIMULATION_QUESTIONS.get(job_id, [])
    if not questions:
        # Fallback generic questions if no specific ones exist
        questions = [
            {"id": "gen_q1", "text": "Are you interested in this field?", "type": "slider", "min": 0, "max": 10},
            {"id": "gen_q2", "text": "Do you have relevant skills?", "type": "choice", "options": ["Yes", "No", "Developing"]}
        ]
    return jsonify(questions), 200

@app.route('/simulation/submit', methods=['POST'])
def submit_simulation():
    data = request.json
    # Expects { "jobId": 1, "answers": { "q1": 8, "q2": "Love it" } }
    job_id = data.get('jobId')
    answers = data.get('answers', {})
    
    # Mock Scoring Logic
    # In a real app, this would be complex. Here we randomize slightly based on answers.
    import random
    
    base_score = 70
    # Simple logic: higher slider values -> higher score
    for key, val in answers.items():
        if isinstance(val, (int, float)):
            if val > 5:
                base_score += 2
        elif isinstance(val, str):
            if "Love" in val or "Yes" in val or "Good" in val:
                base_score += 5
    
    final_score = min(base_score + random.randint(-5, 10), 99)
    
    result = {
        "success_probability": final_score,
        "stress_level": random.choice(["Low", "Moderate", "High"]),
        "growth_speed": random.choice(["Slow", "Steady", "Fast"]),
        "work_satisfaction": random.randint(60, 100),
        "skill_gap": random.randint(10, 40) # % gap
    }
    
    return jsonify(result), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
