import TravellerComponent from '@/app/components/TravellerPage/TravellerPage';
import css from '@/app/components/TravellerPage/TravellerPage.module.css';

export default async function TravellerPage({ params }: { params: { travellerId: string } }) {
  const { travellerId } = await params;
  return (
    <div className={css.containerTraveller}>
      <TravellerComponent travellerId={travellerId} />
    </div>
  );
}
