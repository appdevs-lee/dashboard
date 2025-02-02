from django.urls import path
from . import views

urlpatterns = [
    # 인증 관련 URL
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),

    # 기본 대시보드 페이지 (관제 관리)
    path('', views.monitoring, name='monitoring'),
    
    # 충전소/충전기 관리
    path('charging-stations/', views.charging_stations, name='charging_stations'),
    
    # 고객사/차량 관리
    path('customers/', views.customers, name='customers'),
    
    # 보고서 관리
    path('reports/', views.reports, name='reports'),
    
    # 결제 관리
    path('payments/', views.payments, name='payments'),
]