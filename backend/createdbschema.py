from database import Base,engine
from model import FeedbackModel

Base.metadata.create_all(bind=engine)