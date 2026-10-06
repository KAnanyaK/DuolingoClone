from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import json

from database import engine, get_db, Base
import models

# Ensure tables are created
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Duolingo Clone API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Duolingo Clone API is running"}


@app.get("/users/default")
def get_default_user(db: Session = Depends(get_db)):
    user = db.query(models.User).first()
    if not user:
        raise HTTPException(status_code=404, detail="Default user not found")
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "hearts": user.hearts,
        "xp": user.xp,
        "total_xp": user.xp,
        "gems": user.gems,
        "streak": user.streak_days if hasattr(user, "streak_days") and user.streak_days else user.streak,
        "streak_days": user.streak_days if hasattr(user, "streak_days") and user.streak_days else user.streak,
        "current_course_id": user.current_course_id,
    }


@app.get("/api/users/{user_id}")
def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        # Fallback to default first user
        user = db.query(models.User).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

    streak_val = user.streak_days if hasattr(user, "streak_days") and user.streak_days else user.streak

    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "hearts": user.hearts,
        "total_xp": user.xp,
        "xp": user.xp,
        "streak_days": streak_val,
        "streak": streak_val,
        "gems": user.gems,
        "current_course_id": user.current_course_id,
    }


@app.post("/api/users/{user_id}/refill-hearts")
def refill_user_hearts(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        user = db.query(models.User).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

    user.hearts = 5
    if user.gems and user.gems >= 350:
        user.gems -= 350
    db.commit()
    db.refresh(user)

    return {
        "user_id": user.id,
        "hearts": user.hearts,
        "gems": user.gems,
        "message": "Hearts successfully refilled to 5",
    }


@app.post("/api/users/{user_id}/sync-hearts")
def sync_user_hearts(user_id: int, payload: dict, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        user = db.query(models.User).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

    if "hearts" in payload:
        user.hearts = max(0, min(5, int(payload["hearts"])))
    db.commit()
    db.refresh(user)
    return {"user_id": user.id, "hearts": user.hearts}


@app.get("/api/leaderboard")
def get_leaderboard(db: Session = Depends(get_db)):
    users = db.query(models.User).order_by(models.User.xp.desc()).all()
    # If only 1 user exists, add realistic competitors to showcase a rich leaderboard
    competitors = [
        {"id": 101, "username": "hans_munich", "xp": 140, "streak": 5, "avatar": "🐻"},
        {"id": 102, "username": "clara_berlin", "xp": 90, "streak": 3, "avatar": "🦊"},
        {"id": 103, "username": "lukas_hamburg", "xp": 40, "streak": 2, "avatar": "🦁"},
        {"id": 104, "username": "sophie_vienna", "xp": 20, "streak": 1, "avatar": "🦉"},
    ]

    all_entries = []
    for u in users:
        streak_val = u.streak_days if hasattr(u, "streak_days") and u.streak_days else u.streak
        all_entries.append({
            "id": u.id,
            "username": u.username,
            "xp": u.xp,
            "streak": streak_val,
            "avatar": "🦆",
            "is_current_user": True,
        })

    for c in competitors:
        all_entries.append({
            "id": c["id"],
            "username": c["username"],
            "xp": c["xp"],
            "streak": c["streak"],
            "avatar": c["avatar"],
            "is_current_user": False,
        })

    # Sort descending by XP
    all_entries.sort(key=lambda x: x["xp"], reverse=True)

    # Assign ranks
    for idx, entry in enumerate(all_entries):
        entry["rank"] = idx + 1

    return all_entries


@app.get("/courses")
def get_courses(db: Session = Depends(get_db)):
    courses = db.query(models.Course).all()
    return courses


@app.get("/courses/{course_id}/curriculum")
def get_course_curriculum(course_id: int, db: Session = Depends(get_db)):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    result = {
        "id": course.id,
        "title": course.title,
        "language_code": course.language_code,
        "flag_icon": course.flag_icon,
        "description": course.description,
        "units": [],
    }

    for unit in course.units:
        unit_data = {
            "id": unit.id,
            "title": unit.title,
            "description": unit.description,
            "order": unit.order,
            "skills": [],
        }
        for skill in unit.skills:
            skill_data = {
                "id": skill.id,
                "title": skill.title,
                "icon": skill.icon,
                "order": skill.order,
                "lessons": [
                    {
                        "id": lesson.id,
                        "title": lesson.title,
                        "order": lesson.order,
                        "xp_reward": lesson.xp_reward,
                    }
                    for lesson in skill.lessons
                ],
            }
            unit_data["skills"].append(skill_data)
        result["units"].append(unit_data)

    return result


@app.get("/lessons/{lesson_id}")
def get_lesson(lesson_id: int, db: Session = Depends(get_db)):
    lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    exercises_data = []
    for ex in lesson.exercises:
        exercises_data.append({
            "id": ex.id,
            "type": ex.type,
            "prompt": ex.prompt,
            "target_sentence": ex.target_sentence,
            "options": json.loads(ex.options) if ex.options else [],
            "correct_answer": ex.correct_answer,
            "order": ex.order,
        })

    return {
        "id": lesson.id,
        "title": lesson.title,
        "xp_reward": lesson.xp_reward,
        "exercises": exercises_data,
    }


@app.get("/api/lessons/{lesson_id}")
def get_mock_lesson(lesson_id: int):
    return {
        "id": lesson_id,
        "title": "Lesson 1: Greetings",
        "xp_reward": 10,
        "exercises": [
            {
                "id": 1,
                "type": "translate",
                "prompt": "Translate this sentence",
                "question": "Guten Morgen",
                "answer_data": {
                    "correct_answer": ["Good", "morning"],
                    "word_bank": ["Good", "night", "morning", "hello", "apple"],
                },
            },
            {
                "id": 2,
                "type": "multiple_choice",
                "prompt": "Select the correct translation",
                "question": "The apple",
                "answer_data": {
                    "options": [
                        {"id": 1, "text": "Der Apfel"},
                        {"id": 2, "text": "Das Brot"},
                        {"id": 3, "text": "Die Milch"},
                    ],
                    "correct_option_id": 1,
                },
            },
            {
                "id": 3,
                "type": "match_pairs",
                "prompt": "Tap the matching pairs",
                "answer_data": {
                    "pairs": [
                        {"id": 1, "german": "Junge", "english": "Boy"},
                        {"id": 2, "german": "Mädchen", "english": "Girl"},
                        {"id": 3, "german": "Frau", "english": "Woman"},
                        {"id": 4, "german": "Mann", "english": "Man"},
                    ]
                },
            },
            {
                "id": 4,
                "type": "fill_blank",
                "prompt": "Fill in the missing word",
                "sentence": "Der ___ frisst den Apfel.",
                "answer_data": {
                    "word_bank": ["Junge", "Apfel", "Wasser", "Brot"],
                    "correct_answer": "Junge",
                },
            },
            {
                "id": 5,
                "type": "type_answer",
                "prompt": "Write this in German",
                "question": "Hello",
                "answer_data": {
                    "correct_answer": "Hallo",
                },
            },
        ],
    }


from pydantic import BaseModel
from datetime import date


class ProgressPayload(BaseModel):
    xp_gained: int
    completed_lesson_id: int


@app.post("/api/users/{user_id}/progress")
def update_user_progress(user_id: int, payload: ProgressPayload, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        # Fallback to first user if user_id doesn't match
        user = db.query(models.User).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

    # 1. Add xp_gained to total_xp
    user.xp = (user.xp or 0) + payload.xp_gained

    # 2. Check last_active_date vs today
    today_str = date.today().isoformat()
    if not hasattr(user, "streak_days") or user.streak_days is None:
        user.streak_days = user.streak or 1

    if user.last_active_date != today_str:
        user.streak_days = (user.streak_days or 0) + 1
        user.streak = user.streak_days
        user.last_active_date = today_str

    db.commit()
    db.refresh(user)

    return {
        "total_xp": user.xp,
        "streak_days": user.streak_days or user.streak,
    }


@app.get("/api/courses/{course_id}/path")
def get_course_path(course_id: int, db: Session = Depends(get_db)):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        # Fallback to course 1
        course = db.query(models.Course).first()

    units_data = []
    unit_1_completed = False

    if course and course.units:
        # Check Unit 1 completion (final skill must be completed)
        unit1 = next((u for u in course.units if u.order == 1), None)
        if unit1 and unit1.skills:
            final_skill = unit1.skills[-1]
            unit_1_completed = (final_skill.status == "completed")

        for unit in course.units:
            unit_dict = {
                "id": unit.id,
                "title": unit.title,
                "description": unit.description,
                "order": unit.order,
                "skills": [],
            }

            for s in unit.skills:
                skill_status = s.status

                # Strict Linear Progression: Unit 2 & Unit 3 skills remain strictly locked until final skill of Unit 1 is completed
                if unit.order > 1 and not unit_1_completed:
                    skill_status = "locked"

                unit_dict["skills"].append({
                    "id": s.id,
                    "name": s.title,
                    "status": skill_status,
                    "progress": s.progress,
                    "total_lessons": s.total_lessons,
                    "icon": s.icon,
                })

            units_data.append(unit_dict)
    else:
        # Fallback 3 units with exactly 3 skills each
        units_data = [
            {
                "id": 1,
                "title": "Unit 1: Greetings & Basics",
                "description": "Say hello, introduce yourself, and master daily essentials",
                "order": 1,
                "skills": [
                    {"id": 1, "name": "Greetings", "status": "completed", "progress": 4, "total_lessons": 4, "icon": "star"},
                    {"id": 2, "name": "Basics 1", "status": "active", "progress": 1, "total_lessons": 4, "icon": "book"},
                    {"id": 3, "name": "Phrases", "status": "locked", "progress": 0, "total_lessons": 4, "icon": "message"},
                ],
            },
            {
                "id": 2,
                "title": "Unit 2: Family & Friends",
                "description": "Talk about family members, relationships, and friends",
                "order": 2,
                "skills": [
                    {"id": 4, "name": "Family", "status": "locked", "progress": 0, "total_lessons": 4, "icon": "star"},
                    {"id": 5, "name": "Home", "status": "locked", "progress": 0, "total_lessons": 4, "icon": "book"},
                    {"id": 6, "name": "Friends", "status": "locked", "progress": 0, "total_lessons": 4, "icon": "message"},
                ],
            },
            {
                "id": 3,
                "title": "Unit 3: Colors & Numbers",
                "description": "Count numbers and describe things with vibrant colors",
                "order": 3,
                "skills": [
                    {"id": 7, "name": "Numbers", "status": "locked", "progress": 0, "total_lessons": 4, "icon": "star"},
                    {"id": 8, "name": "Colors", "status": "locked", "progress": 0, "total_lessons": 4, "icon": "book"},
                    {"id": 9, "name": "Shopping", "status": "locked", "progress": 0, "total_lessons": 4, "icon": "utensils"},
                ],
            },
        ]

    return {
        "course_id": course_id,
        "course_title": "German",
        "units": units_data,
    }





