from django.urls import path
from . import views

urlpatterns = [
    path('set/', views.VocabularySetView.as_view()),
    path('set/<str:set_id>/', views.VocabularySetDetailView.as_view())
]
