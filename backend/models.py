from datetime import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    ForeignKey,
    DateTime,
    Text,
)
from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hearts = Column(Integer, default=5, nullable=False)
    xp = Column(Integer, default=0, nullable=False)
    gems = Column(Integer, default=500, nullable=False)
    streak = Column(Integer, default=0, nullable=False)
    streak_days = Column(Integer, default=1, nullable=False)
    streak_freeze_active = Column(Boolean, default=False, nullable=False)
    last_active_date = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    current_course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)
    current_course = relationship("Course", back_populates="users")


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    language_code = Column(String(10), nullable=False)  # e.g., 'de', 'es', 'fr'
    flag_icon = Column(String(255), nullable=True)
    description = Column(String(255), nullable=True)

    users = relationship("User", back_populates="current_course")
    units = relationship("Unit", back_populates="course", cascade="all, delete-orphan", order_by="Unit.order")


class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    title = Column(String(150), nullable=False)
    description = Column(String(255), nullable=True)
    order = Column(Integer, default=1, nullable=False)

    course = relationship("Course", back_populates="units")
    skills = relationship("Skill", back_populates="unit", cascade="all, delete-orphan", order_by="Skill.order")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(Integer, ForeignKey("units.id"), nullable=False)
    title = Column(String(100), nullable=False)
    icon = Column(String(50), default="star")  # star, book, trophy, headset, etc.
    order = Column(Integer, default=1, nullable=False)
    status = Column(String(20), default="locked", nullable=False)  # 'completed', 'active', 'locked'
    progress = Column(Integer, default=0, nullable=False)
    total_lessons = Column(Integer, default=4, nullable=False)

    unit = relationship("Unit", back_populates="skills")
    lessons = relationship("Lesson", back_populates="skill", cascade="all, delete-orphan", order_by="Lesson.order")


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    title = Column(String(100), nullable=False)
    order = Column(Integer, default=1, nullable=False)
    xp_reward = Column(Integer, default=10, nullable=False)

    skill = relationship("Skill", back_populates="lessons")
    exercises = relationship("Exercise", back_populates="lesson", cascade="all, delete-orphan", order_by="Exercise.order")


class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    type = Column(String(50), nullable=False)  # 'translate_to_target', 'translate_to_source', 'multiple_choice', 'select_word'
    prompt = Column(String(255), nullable=False)
    target_sentence = Column(String(255), nullable=True)
    audio_url = Column(String(255), nullable=True)
    options = Column(Text, nullable=True)  # JSON-encoded array of string options
    correct_answer = Column(String(255), nullable=False)
    order = Column(Integer, default=1, nullable=False)

    lesson = relationship("Lesson", back_populates="exercises")
