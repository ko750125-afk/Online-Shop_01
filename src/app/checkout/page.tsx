'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { useCart } from '@/store/use-cart';
import { supabase } from '@/lib/supabase';
import { createOrderAction } from '@/app/actions/order';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingBag, 
  ChevronLeft, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  Search, 
  Sparkles, 
  MessageSquare, 
  ShieldCheck,
  ExternalLink,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { ProductImageThumb } from '@/components/product-image';

// Daum 주소 및 포트원(아임포트) SDK 전역 타입 정의
declare global {
  interface Window {
    daum: any;
    IMP: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // 외주 미팅 시연을 위한 결제 모드 토글 ('portone': 실제창 팝업 / 'direct': 1초 패스)
  const [paymentMode, setPaymentMode] = useState<'portone' | 'direct'>('portone');
  const [createdOrderId, setCreatedOrderId] = useState<string>('ORD-DEMO-001');

  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    postcode: '',
    address: '',
    detailAddress: '',
  });

  useEffect(() => {
    setMounted(true);
    if (mounted && items.length === 0 && !isSuccess) {
      router.push('/');
    }
  }, [items, mounted, isSuccess, router]);

  if (!mounted) return null;

  // 우편번호 검색 핸들러
  const handlePostcode = () => {
    if (!window.daum || !window.daum.Postcode) {
      alert('주소 검색 모듈을 불러오는 중입니다. 잠시 후 다시 시도해 주세요.');
      return;
    }
    new window.daum.Postcode({
      oncomplete: function (data: any) {
        let fullAddr = data.address;
        let extraAddr = '';

        if (data.addressType === 'R') {
          if (data.bname !== '') extraAddr += data.bname;
          if (data.buildingName !== '') {
            extraAddr += extraAddr !== '' ? ', ' + data.buildingName : data.buildingName;
          }
          fullAddr += extraAddr !== '' ? ' (' + extraAddr + ')' : '';
        }

        setFormData((prev) => ({
          ...prev,
          postcode: data.zonecode,
          address: fullAddr,
        }));
        
        const detailInput = document.getElementById('detailAddress');
        if (detailInput) detailInput.focus();
      },
    }).open();
  };

  // 실제 데이터베이스 저장 및 성공 후처리 통합 로직
  const executeOrderSave = async (status: string = 'completed') => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const finalAddress = `[${formData.postcode}] ${formData.address} ${formData.detailAddress}`;
      
      const result = await createOrderAction({
        customer_name: formData.customer_name,
        phone: formData.phone,
        address: finalAddress,
        total_amount: getTotalPrice(),
        items: items,
        user_id: session?.user?.id || null,
        // @ts-ignore
        status: status // 'completed'로 전달하여 결제 완료 상태 즉시 기록
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      // 모의 알림톡에 표시할 임의 주문번호 생성
      setCreatedOrderId(`ORD-${Date.now().toString().slice(-6)}`);
      setIsSuccess(true);
      clearCart();
      router.refresh(); 
    } catch (error) {
      console.error('Order save error:', error);
      alert('주문 데이터 저장 중 오류가 발생했습니다.');
      setIsSubmitting(false);
    }
  };

  // 폼 제출 핸들러 (포트원 연동 분기)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.address) {
      alert('주소 찾기 버튼을 통해 배송지를 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);

    const orderTitle = items.length > 1 
      ? `${items[0].name} 외 ${items.length - 1}건` 
      : items[0].name;
    const finalAmount = getTotalPrice();

    if (paymentMode === 'direct') {
      // 1초 패스 모드: SDK 팝업 없이 즉시 DB 인서트 (시연 속도 우선)
      await executeOrderSave('completed');
    } else {
      // 포트원 실제 결제창 팝업 모드
      const IMP = window.IMP;
      if (!IMP) {
        alert('포트원 결제 모듈이 로드되지 않았습니다. 페이지를 새로고침하거나 1초 다이렉트 패스를 이용해 주세요.');
        setIsSubmitting(false);
        return;
      }

      // 공용 테스트 가맹점 식별코드 연동
      IMP.init('imp20611933'); 
      
      const finalAddress = `[${formData.postcode}] ${formData.address} ${formData.detailAddress}`;
      
      IMP.request_pay({
        pg: 'html5_inicis', // 이니시스 테스트 웹표준
        pay_method: 'card',
        merchant_uid: `mid_${Date.now()}`,
        name: orderTitle,
        amount: finalAmount,
        buyer_email: 'client@urbandeco.shop',
        buyer_name: formData.customer_name,
        buyer_tel: formData.phone,
        buyer_addr: finalAddress,
        // 로컬호스트 환경 및 크롬 샌드박스 iframe 에러 방지용 리다이렉트 속성
        m_redirect_url: typeof window !== 'undefined' ? `${window.location.origin}/checkout` : undefined,
      }, async (rsp: any) => {
        if (rsp.success) {
          // 결제 성공 시 DB 저장 진행
          await executeOrderSave('completed');
        } else {
          // 결제창 닫기 또는 취소 시
          alert(`결제 시연이 취소되었거나 중단되었습니다.\n(${rsp.error_msg})`);
          setIsSubmitting(false);
        }
      });
    }
  };

  // 결제 완료 후처리 화면 (외주 수주를 위한 클라이언트 훅 UI 장착)
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 pb-20">
        <div className="max-w-xl w-full space-y-8 animate-in fade-in zoom-in duration-500">
          
          {/* 상단 완료 축하 헤더 */}
          <div className="text-center space-y-3">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mx-auto border border-green-500/20 shadow-inner">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">가상 결제 시연 완료</h1>
            <p className="text-muted-foreground">
              주문 데이터베이스(`shop_orders`)에 <span className="text-green-500 font-semibold">&lsquo;결제 완료(completed)&rsquo;</span> 상태로 안전하게 저장되었습니다.
            </p>
          </div>

          {/* 외주 클라이언트 설득용: 모의 알림톡 발송 시뮬레이션 박스 */}
          <div className="bg-secondary/40 border border-border rounded-2xl p-6 space-y-4 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-extrabold px-3 py-1 rounded-bl-xl tracking-wider">
              KAKAO ALIMTALK
            </div>
            
            <div className="flex items-center space-x-2 text-yellow-500 font-bold text-sm">
              <MessageSquare className="w-4 h-4" />
              <span>고객 알림톡 발송 자동화 (시뮬레이션 뷰)</span>
            </div>
            
            <div className="bg-background/80 rounded-xl p-4 text-xs space-y-2 font-mono text-muted-foreground border border-border/50">
              <p className="text-foreground font-semibold">[Urban Deco 구매 완료 안내]</p>
              <p>{formData.customer_name} 고객님, 주문이 성공적으로 접수되었습니다.</p>
              <p className="pt-1 border-t border-border/40">주문번호: {createdOrderId}</p>
              <p>결제금액: ₩{getTotalPrice().toLocaleString()}</p>
              <p className="text-[11px] text-yellow-500/80 pt-1">💡 외주 소구점: 실제 계약 시 사장님이 원하시는 알림톡/문자 발송 API를 즉시 연동해 드립니다.</p>
            </div>
          </div>

          {/* 하단 백오피스 전환 및 액션 버튼 가이드 */}
          <div className="space-y-3 pt-2">
            <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl text-center">
              <p className="text-xs text-muted-foreground">
                <span className="font-bold text-primary">사장님 백오피스 시연 팁</span>: 지금 바로 관리자 페이지로 이동하여 방금 결제된 내역을 직접 확인하고 취소/관리하는 백오피스 기능을 체험해 보세요.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button 
                asChild
                variant="outline" 
                className="h-12 rounded-xl font-medium border-border hover:bg-secondary/60"
              >
                <Link href="/">
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  쇼핑몰 홈으로
                </Link>
              </Button>
              
              <Button 
                asChild
                className="h-12 rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
              >
                <Link href="/admin/orders">
                  백오피스 관리자 체험하기
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Daum 우편번호 및 포트원 표준 결제 라이브러리 비동기 로드 */}
      <Script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" strategy="lazyOnload" />
      <Script src="https://cdn.iamport.kr/v1/iamport.js" strategy="lazyOnload" />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
        
        {/* 상단 외주 홍보용 강력한 소구점 배너 */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary to-background border border-primary/20 rounded-2xl p-6 relative overflow-hidden shadow-sm">
          <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
            <Sparkles className="w-60 h-60" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center space-x-2 text-xs font-bold text-primary tracking-wider uppercase bg-primary/10 w-fit px-2.5 py-0.5 rounded-full mb-1">
                <Sparkles className="w-3 h-3 mr-1 animate-pulse" />
                외주 확장성 소구점 안내
              </div>
              <h3 className="text-base font-bold text-foreground">
                PG사 변경 시 코드 한 줄만 바꾸면 즉시 연동되는 확장성 아키텍처
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                나중에 사장님이 <span className="text-foreground font-medium">KG이니시스를 쓰든, 토스페이먼츠를 쓰든</span> 복잡한 재개발 없이 파라미터 단 한 줄만 전환하면 즉각 반영해 드릴 수 있는 유연한 설계 구조입니다.
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground bg-background/60 border border-border px-3 py-2 rounded-lg shrink-0">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span>포트원 V1 SDK 테스트 환경 연동</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            장바구니 수정하기
          </Link>
          <span className="text-xs text-muted-foreground italic">
            * 본 사이트는 샘플이며, 실제 결제 금액은 청구되지 않습니다.
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* 입력 폼 측면 */}
          <div className="lg:col-span-7 space-y-8">
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
              
              {/* 배송지 정보 섹션 */}
              <section className="space-y-5 bg-secondary/20 p-6 rounded-2xl border border-border/50">
                <div className="flex items-center space-x-2 text-primary font-bold">
                  <Truck className="w-5 h-5" />
                  <h2 className="text-lg tracking-tight">배송지 정보 입력</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs">받는 분 성함</Label>
                    <Input 
                      id="name" 
                      placeholder="홍길동" 
                      required 
                      className="h-11 rounded-xl bg-background"
                      value={formData.customer_name}
                      onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs">연락처</Label>
                    <Input 
                      id="phone" 
                      placeholder="010-1234-5678" 
                      required 
                      className="h-11 rounded-xl bg-background"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  <Label className="text-xs">배송지 주소</Label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="우편번호" 
                      readOnly 
                      required
                      value={formData.postcode}
                      className="w-32 bg-secondary/40 h-11 rounded-xl cursor-not-allowed"
                    />
                    <Button 
                      type="button" 
                      onClick={handlePostcode}
                      variant="secondary"
                      className="h-11 rounded-xl px-5 font-bold hover:bg-secondary/80 border border-border"
                    >
                      <Search className="w-4 h-4 mr-1.5" />
                      주소 찾기
                    </Button>
                  </div>
                  <Input 
                    placeholder="기본 주소" 
                    readOnly 
                    required
                    value={formData.address}
                    className="h-11 bg-secondary/40 rounded-xl cursor-not-allowed"
                  />
                  <Input 
                    id="detailAddress"
                    placeholder="상세 주소를 입력해 주세요 (동/호수 등)" 
                    required 
                    className="h-11 rounded-xl bg-background"
                    value={formData.detailAddress}
                    onChange={(e) => setFormData({...formData, detailAddress: e.target.value})}
                  />
                </div>
              </section>

              {/* 시연 전용 결제 모드 선택 토글 */}
              <section className="space-y-4 bg-secondary/20 p-6 rounded-2xl border border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-primary font-bold">
                    <CreditCard className="w-5 h-5" />
                    <h2 className="text-lg tracking-tight">결제 시연 방식 선택</h2>
                  </div>
                  <span className="text-[11px] bg-secondary text-muted-foreground px-2 py-0.5 rounded font-mono">
                    PortOne V1
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setPaymentMode('portone')}
                    className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
                      paymentMode === 'portone' 
                        ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                        : 'border-border bg-background hover:bg-secondary/40'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-bold text-foreground">① 실제 카드창 팝업</span>
                      <CreditCard className={`w-4 h-4 ${paymentMode === 'portone' ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <span className="text-[11px] text-muted-foreground line-clamp-2">
                      실제 이니시스/카카오페이 테스트 결제창을 브라우저에 띄워 완벽 시연
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMode('direct')}
                    className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
                      paymentMode === 'direct' 
                        ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                        : 'border-border bg-background hover:bg-secondary/40'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-bold text-foreground">② 1초 다이렉트 패스</span>
                      <Zap className={`w-4 h-4 ${paymentMode === 'direct' ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <span className="text-[11px] text-muted-foreground line-clamp-2">
                      팝업 없이 내부 로직만으로 즉시 결제 완료 상태를 DB에 고속 저장
                    </span>
                  </button>
                </div>
                
                {paymentMode === 'portone' && (
                  <p className="text-[11px] text-muted-foreground bg-background/80 p-2.5 rounded-lg border border-border/40 text-center italic">
                    💡 테스트 카드창 호출 후, 팝업 내에서 제공되는 가상 카드번호를 선택하시면 모의 결제가 이루어집니다.
                  </p>
                )}
              </section>

            </form>
          </div>

          {/* 결제 요약 측면 */}
          <div className="lg:col-span-5">
            <div className="bg-secondary/30 border border-border/60 rounded-3xl p-6 sticky top-24 space-y-6 shadow-sm">
              <h2 className="text-base font-bold text-foreground flex items-center">
                <ShoppingBag className="w-4 h-4 mr-2 text-primary" />
                주문 상품 요약
              </h2>
              
              <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs gap-3">
                    <div className="flex items-center space-x-2.5 overflow-hidden">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-background shrink-0 border border-border/50">
                        <ProductImageThumb
                          src={item.image_url}
                          alt={item.name}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-medium text-foreground truncate">{item.name}</p>
                        <p className="text-[11px] text-muted-foreground">수량: {item.quantity}개</p>
                      </div>
                    </div>
                    <p className="font-bold text-foreground shrink-0">
                      ₩{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <Separator className="bg-border/60" />

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">상품 소계</span>
                  <span>₩{getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">배송비</span>
                  <span className="text-green-500 font-medium">전 상품 무료배송</span>
                </div>
                <Separator className="bg-border/60 pt-1" />
                <div className="flex justify-between text-base font-extrabold text-foreground pt-1">
                  <span>총 시연 결제금액</span>
                  <span className="text-primary">₩{getTotalPrice().toLocaleString()}</span>
                </div>
              </div>

              <Button 
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full h-14 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-md transition-all mt-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2"></span>
                    결제 모듈 구동 중...
                  </span>
                ) : (
                  `₩${getTotalPrice().toLocaleString()} ${paymentMode === 'portone' ? '포트원 안전결제 연동' : '1초 가상 체험 완료'}`
                )}
              </Button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
