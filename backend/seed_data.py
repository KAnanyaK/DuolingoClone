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

        # 2. Create Default User (5 hearts, 0 XP)
        default_user = User(
            username="duo_learner",
            email="learner@duolingo.local",
            hearts=5,
            xp=0,
            gems=500,
            streak=1,
            streak_days=1,
            last_active_date=None,
            current_course_id=german_course.id
        )
        db.add(default_user)
        db.flush()

        # 3. Create Unit 1
        unit1 = Unit(
            course_id=german_course.id,
            title="Unit 1: Basic German Greetings",
            description="Say hello, introduce yourself, and order basic items",
            order=1
        )
        db.add(unit1)
        db.flush()

        # 4. Create Skills in Unit 1
        skill1 = Skill(
            unit_id=unit1.id,
            title="Greetings",
            icon="star",
            order=1
        )
        skill2 = Skill(
            unit_id=unit1.id,
            title="Basics 1",
            icon="book",
            order=2
        )
        db.add_all([skill1, skill2])
        db.flush()

        # 5. Create Lessons in Skill 1
        lesson1 = Lesson(
            skill_id=skill1.id,
            title="Lesson 1: Hello & Goodbye",
            order=1,
            xp_reward=10
        )
        lesson2 = Lesson(
            skill_id=skill1.id,
            title="Lesson 2: Polite Phrases",
            order=2,
            xp_reward=10
        )
        db.add_all([lesson1, lesson2])
        db.flush()

        # 6. Create Exercises for Lesson 1
        exercises = [
            Exercise(
                lesson_id=lesson1.id,
                type="multiple_choice",
                prompt="How do you say 'Hello' in German?",
                target_sentence="Hallo",
                options=json.dumps(["Hallo", "Tschüss", "Danke", "Guten Abend"]),
                correct_answer="Hallo",
                order=1
            ),
            Exercise(
                lesson_id=lesson1.id,
                type="translate_to_source",
                prompt="Translate this sentence:",
                target_sentence="Guten Morgen!",
                options=json.dumps(["Good", "morning", "night", "Hello", "Thanks", "please"]),
                correct_answer="Good morning",
                order=2
            ),
            Exercise(
                lesson_id=lesson1.id,
                type="multiple_choice",
                prompt="Which of these means 'Bye'?",
                target_sentence="Tschüss",
                options=json.dumps(["Tschüss", "Bitte", "Ja", "Nein"]),
                correct_answer="Tschüss",
                order=3
            ),
            Exercise(
                lesson_id=lesson1.id,
                type="translate_to_target",
                prompt="Translate 'Thank you very much':",
                target_sentence="Thank you very much",
                options=json.dumps(["Danke", "sehr", "Guten", "Tag", "Hallo", "bitte"]),
                correct_answer="Danke sehr",
                order=4
            )
        ]
        db.add_all(exercises)

        db.commit()
        print("Database seeded successfully with dummy German course, Unit 1, lessons, exercises, and default user!")

    except Exception as e:
        db.rollback()
        print(f"Error during database seeding: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
