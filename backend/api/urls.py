from django.urls import path
from . import views

urlpatterns = [
    path('predict/', views.predict_api, name='predict_api'),
    path('students/', views.students_api, name='students_api'),
    path('students/<str:pk>/', views.student_detail_api, name='student_detail_api'),
    path('upload/', views.upload_csv_api, name='upload_csv_api'),
    path('analytics/', views.analytics_api, name='analytics_api'),
]
