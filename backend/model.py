from sqlalchemy import Column,Integer,String,DateTime,func
from database import Base

class FeedbackModel(Base):
    __tablename__='feedback'
    id=Column(Integer,primary_key=True,index=True)
    rating=Column(Integer)
    comment=Column(String,nullable=True)
    created_at=Column(DateTime(timezone=True),server_default=func.now())