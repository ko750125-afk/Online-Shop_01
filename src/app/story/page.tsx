import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: '브랜드 스토리',
  description: 'Urban Deco의 시작과 철학 — 집중을 위한 워크스페이스 큐레이션.',
};

export default function StoryPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto space-y-20">
          <div className="text-center space-y-6">
            <Badge variant="outline" className="text-primary border-primary">SINCE 2024</Badge>
            <h1 className="text-5xl md:text-8xl font-black text-primary tracking-tighter">Urban Deco</h1>
            <p className="text-2xl text-muted-foreground italic font-light">
              &ldquo;사물을 넘어, 당신의 집중을 큐레이션합니다.&rdquo;
            </p>
          </div>

          <div className="aspect-[21/9] overflow-hidden rounded-[2.5rem] shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" 
              alt="Urban Deco 워크스페이스" 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-primary">우리의 시작</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Urban Deco는 단순한 사무용품을 파는 곳이 아닙니다. 
                우리는 매일 마주하는 작업 공간이 우리의 사고와 창의성에 얼마나 큰 영향을 미치는지 잘 알고 있습니다.
                복잡한 세상 속에서 본질에 집중할 수 있는 미니멀한 도구들을 큐레이션합니다.
              </p>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-primary">우리의 철학</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                우리는 '지속 가능한 아름다움'과 '기능적 단순함'을 지향합니다.
                오랜 시간 곁에 두고 사용할 수 있는 소재와 시간이 흘러도 변치 않는 디자인의 제품만을 엄선합니다.
                당신의 책상 위에 놓인 작은 소품 하나가 당신의 하루를 바꿀 수 있다고 믿습니다.
              </p>
            </div>
          </div>

          <div className="bg-secondary p-12 md:p-20 rounded-[3rem] text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold text-primary tracking-tight">Focus on what matters.</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Urban Deco와 함께 당신의 비전이 현실이 되는 완벽한 워크스페이스를 만들어보세요.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="opacity-70">&copy; 2026 Urban Deco. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
