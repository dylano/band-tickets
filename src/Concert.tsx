import DOMPurify from 'dompurify';
import dayjs from 'dayjs';
import styles from './Concert.module.css';
import { TicketForm } from './TicketForm';

export interface Ticket {
  type: string;
  name: string;
  description: string;
  cost: number; // Price in cents
}

export interface Band {
  id: string;
  name: string;
  date: number;
  location: string;
  description_blurb: string;
  imgUrl: string;
  ticketTypes: Ticket[];
}

export function Concert({ band }: { band: Band }) {
  const cleanDescription = DOMPurify.sanitize(band.description_blurb);
  const showDate = dayjs(band.date).format('dddd, MMMM D');

  return (
    <div className={styles.concert}>
      <div className={styles.heading}>
        <h1>{band.name}</h1>
        <p className={styles.showInfo}>
          <span>{showDate}</span>
          <span>{band.location}</span>
        </p>
      </div>
      <div className={styles.content}>
        <div className={styles.bandInfo}>
          <img src={band.imgUrl} alt={band.name} />
          <div dangerouslySetInnerHTML={{ __html: cleanDescription }} />
        </div>
        <TicketForm tickets={band.ticketTypes} />
      </div>
    </div>
  );
}
