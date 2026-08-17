from django.db import models

class StudentRecord(models.Model):
    student_code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    gender = models.CharField(max_length=20, default="Female")
    age = models.IntegerField(default=20)
    program = models.CharField(max_length=100, default="Computer Engineering")
    parental_education = models.CharField(max_length=50, default="Graduate")
    
    study_hours = models.FloatField(default=18.0)
    attendance = models.FloatField(default=90.0)
    past_score = models.FloatField(default=75.0)
    assignment_score = models.FloatField(default=80.0)
    sleep_hours = models.FloatField(default=7.0)
    
    extracurricular = models.CharField(max_length=10, default="Yes")
    internet_access = models.CharField(max_length=10, default="Yes")
    
    final_exam_score = models.FloatField(null=True, blank=True)
    predicted_score = models.FloatField(null=True, blank=True)
    risk_level = models.CharField(max_length=20, default="Low risk")
    confidence = models.FloatField(default=92.0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student_code} - {self.name}"

class MLModel(models.Model):
    model_name = models.CharField(max_length=100)
    algorithm = models.CharField(max_length=100)
    r2_score = models.FloatField()
    mae_score = models.FloatField()
    mse_score = models.FloatField()
    rmse_score = models.FloatField()
    training_time = models.FloatField()
    is_active = models.BooleanField(default=False)
    hyperparameters = models.JSONField(default=dict)
    trained_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.algorithm} (R2: {self.r2_score:.2f})"

class PredictionLog(models.Model):
    student = models.ForeignKey(StudentRecord, on_delete=models.CASCADE, null=True, blank=True)
    input_features = models.JSONField()
    predicted_score = models.FloatField()
    risk_level = models.CharField(max_length=20)
    confidence = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
