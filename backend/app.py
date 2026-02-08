from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Enhanced Mock Data
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

# Mock data for detailed comparison (could be merged into JOBS, but simulating a separate detailed fetch)
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

if __name__ == '__main__':
    app.run(debug=True, port=5000)
