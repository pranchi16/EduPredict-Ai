from rest_framework import serializers
from .models import StudentRecord, MLModel, PredictionLog

class StudentRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentRecord
        fields = '__all__'

class MLModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = MLModel
        fields = '__all__'

class PredictionLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = PredictionLog
        fields = '__all__'
