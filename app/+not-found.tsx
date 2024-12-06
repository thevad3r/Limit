import FadeView from '@/components/FadeView';
import { GoBackHeader } from '@/components/GoBackHeader';

export default function NotFoundScreen() {
  return (
      <FadeView>
        <GoBackHeader title='Страница не найдена'/>
      </FadeView>
  );
}