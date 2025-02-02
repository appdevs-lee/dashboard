from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.urls import reverse

def login_view(request):
    if request.user.is_authenticated:
        return redirect('monitoring')
        
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            next_url = request.GET.get('next', 'monitoring')
            return redirect(next_url)
        else:
            return render(request, 'dashboard/login.html', {
                'error': '아이디 또는 비밀번호가 올바르지 않습니다.'
            })
    
    return render(request, 'dashboard/login.html')

def logout_view(request):
    logout(request)
    return redirect('login')

@login_required
def monitoring(request):
    context = {
        'page_title': '관제 관리',
    }
    return render(request, 'dashboard/monitoring.html', context)

@login_required
def charging_stations(request):
    context = {
        'page_title': '충전소 / 충전기',
    }
    return render(request, 'dashboard/charging_stations.html', context)

@login_required
def customers(request):
    context = {
        'page_title': '고객사/차량 관리',
    }
    return render(request, 'dashboard/customers.html', context)

@login_required
def reports(request):
    context = {
        'page_title': '보고서 관리',
    }
    return render(request, 'dashboard/reports.html', context)

@login_required
def payments(request):
    context = {
        'page_title': '결제 관리',
    }
    return render(request, 'dashboard/payments.html', context)