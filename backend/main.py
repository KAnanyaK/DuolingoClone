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
        "gems": user.gems,
        "streak": user.streak,
        "current_course_id": user.current_course_id,
    }


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



