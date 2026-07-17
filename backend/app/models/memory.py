import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
# Fix: Import our custom Base that connects to SQLAlchemy
from app.database.base import Base

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(String(36), primary_key=True, index=True)
    user_goal = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String(32), default="active")

    plans = relationship("StoredPlan", back_populates="session", cascade="all, delete-orphan")

class StoredPlan(Base):
    __tablename__ = "stored_plans"

    id = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(String(36), ForeignKey("chat_sessions.id"), nullable=False)
    raw_plan_json = Column(JSON, nullable=False)
    complexity = Column(String(16), default="medium")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    session = relationship("ChatSession", back_populates="plans")
    logs = relationship("ExecutionLog", back_populates="plan", cascade="all, delete-orphan")

class ExecutionLog(Base):
    __tablename__ = "execution_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    plan_id = Column(Integer, ForeignKey("stored_plans.id"), nullable=False)
    step_id = Column(Integer, nullable=False)
    capability_name = Column(String(255), nullable=False)
    status = Column(String(32), nullable=False)
    output_payload = Column(JSON, nullable=True)
    error_summary = Column(Text, nullable=True)
    runtime_duration_ms = Column(Integer, default=0)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    plan = relationship("StoredPlan", back_populates="logs")