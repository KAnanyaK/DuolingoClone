import json
from database import engine, SessionLocal, Base
from models import User, Course, Unit, Skill, Lesson, Exercise


def seed():
    # Recreate tables cleanly
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # 1. Create Default Course (German)
        german_course = Course(
            title="German",
            language_code="de",
            flag_icon="🇩🇪",
            description="Learn German from scratch with fundamentals and daily conversations."
        )
        db.add(german_course)
        db.flush()

        # 2. Create Default User (5 completed lessons * 10 = 50 XP, 5 hearts, 500 gems)
        default_user = User(
            username="duo_learner",
            email="learner@duolingo.local",
            hearts=5,
            xp=50,
            gems=500,
            streak=1,
            streak_days=1,
            last_active_date=None,
            current_course_id=german_course.id
        )
        db.add(default_user)
        db.flush()

        # ==========================================
        # SECTION 1 - UNIT 1: Greetings & Basics
        # Skill 1 'completed', Skill 2 'active', remaining 'locked'
        # ==========================================
        unit1 = Unit(
            course_id=german_course.id,
            title="Unit 1: Greetings & Basics",
            description="Say hello, introduce yourself, and master daily essentials",
            order=1
        )
        db.add(unit1)
        db.flush()

        u1_skills = [
            Skill(unit_id=unit1.id, title="Greetings", icon="star", order=1, status="completed", progress=4, total_lessons=4),
            Skill(unit_id=unit1.id, title="Basics 1", icon="book", order=2, status="active", progress=0, total_lessons=4),
            Skill(unit_id=unit1.id, title="Phrases", icon="message", order=3, status="locked", progress=0, total_lessons=4),
        ]
        db.add_all(u1_skills)
        db.flush()

        # ==========================================
        # SECTION 1 - UNIT 2: Family & Friends
        # Strictly locked (all skills locked, exactly 3 skills)
        # ==========================================
        unit2 = Unit(
            course_id=german_course.id,
            title="Unit 2: Family & Friends",
            description="Talk about family members, relationships, and friends",
            order=2
        )
        db.add(unit2)
        db.flush()

        u2_skills = [
            Skill(unit_id=unit2.id, title="Family", icon="star", order=1, status="locked", progress=0, total_lessons=4),
            Skill(unit_id=unit2.id, title="Home", icon="book", order=2, status="locked", progress=0, total_lessons=4),
            Skill(unit_id=unit2.id, title="Friends", icon="message", order=3, status="locked", progress=0, total_lessons=4),
        ]
        db.add_all(u2_skills)
        db.flush()

        # ==========================================
        # SECTION 1 - UNIT 3: Colors & Numbers
        # Strictly locked (all skills locked, exactly 3 skills)
        # ==========================================
        unit3 = Unit(
            course_id=german_course.id,
            title="Unit 3: Colors & Numbers",
            description="Count numbers and describe things with vibrant colors",
            order=3
        )
        db.add(unit3)
        db.flush()

        u3_skills = [
            Skill(unit_id=unit3.id, title="Numbers", icon="star", order=1, status="locked", progress=0, total_lessons=4),
            Skill(unit_id=unit3.id, title="Colors", icon="book", order=2, status="locked", progress=0, total_lessons=4),
            Skill(unit_id=unit3.id, title="Shopping", icon="utensils", order=3, status="locked", progress=0, total_lessons=4),
        ]
        db.add_all(u3_skills)
        db.flush()

        # All skills in all units receive lessons containing all 5 exercise types
        all_skills = u1_skills + u2_skills + u3_skills
        for skill in all_skills:
            lesson = Lesson(
                skill_id=skill.id,
                title=f"{skill.title} Lesson",
                order=1,
                xp_reward=10
            )
            db.add(lesson)
            db.flush()

            exercises = [
                # 1. Translate
                Exercise(
                    lesson_id=lesson.id,
                    type="translate",
                    prompt="Translate this sentence",
                    target_sentence="Guten Morgen",
                    options=json.dumps(["Good", "night", "morning", "hello", "apple"]),
                    correct_answer="Good morning",
                    order=1
                ),
                # 2. Multiple Choice
                Exercise(
                    lesson_id=lesson.id,
                    type="multiple_choice",
                    prompt="Select the correct translation",
                    target_sentence="The apple",
                    options=json.dumps([
                        {"id": 1, "text": "Der Apfel"},
                        {"id": 2, "text": "Das Brot"},
                        {"id": 3, "text": "Die Milch"},
                    ]),
                    correct_answer="1",
                    order=2
                ),
                # 3. Pronunciation (Placeholder activity)
                Exercise(
                    lesson_id=lesson.id,
                    type="pronunciation",
                    prompt="Say Guten Morgen",
                    target_sentence="Guten Morgen",
                    options=json.dumps({"target_text": "Guten Morgen", "translation": "Good morning", "phonetic": "ˈɡuːtn̩ ˈmɔʁɡn̩"}),
                    correct_answer="Guten Morgen",
                    order=3
                ),
                # 4. Match Pairs
                Exercise(
                    lesson_id=lesson.id,
                    type="match_pairs",
                    prompt="Tap the matching pairs",
                    target_sentence=None,
                    options=json.dumps([
                        {"id": 1, "german": "Junge", "english": "Boy"},
                        {"id": 2, "german": "Mädchen", "english": "Girl"},
                        {"id": 3, "german": "Frau", "english": "Woman"},
                        {"id": 4, "german": "Mann", "english": "Man"},
                    ]),
                    correct_answer="",
                    order=4
                ),
                # 5. Fill in the Blank
                Exercise(
                    lesson_id=lesson.id,
                    type="fill_blank",
                    prompt="Fill in the missing word",
                    target_sentence="Der ___ frisst den Apfel.",
                    options=json.dumps(["Junge", "Apfel", "Wasser", "Brot"]),
                    correct_answer="Junge",
                    order=5
                ),
                # 6. Type the Answer
                Exercise(
                    lesson_id=lesson.id,
                    type="type_answer",
                    prompt="Write this in German",
                    target_sentence="Hello",
                    options=json.dumps([]),
                    correct_answer="Hallo",
                    order=6
                ),
            ]
            db.add_all(exercises)

        db.commit()
        print("Database seeded with exactly 3 skills per unit and 5 exercise types per lesson successfully!")

    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
