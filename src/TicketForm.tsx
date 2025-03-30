import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { Ticket } from './Concert';
import styles from './TicketForm.module.css';

const ticketOrderSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(2, 'Required'),
  address: z.string(),
  ccNumber: z.string(),
  ccExpiration: z.string(),
  ccSecurity: z.string(),
});
export type TicketOrder = z.infer<typeof ticketOrderSchema>;

function TicketOption({ ticket }: { ticket: Ticket }) {
  const price = `$${ticket.cost / 100}`;

  function processQuantityChange(
    e: React.ChangeEvent<HTMLInputElement>,
    ticket: Ticket
  ) {
    console.log(`Ticket ${ticket.name} changed to ${e.target.value}`);
  }

  return (
    <div className={styles.ticketOption}>
      <div>
        <h4>{ticket.name}</h4>
        <p>{ticket.description}</p>
        <h4>{price}</h4>
      </div>
      <div className={styles.inputIncr}>
        <input
          type="number"
          min={0}
          max={6}
          onChange={(e) => processQuantityChange(e, ticket)}
        />
      </div>
    </div>
  );
}

interface TicketFormProps {
  tickets: Ticket[];
}
export function TicketForm({ tickets }: TicketFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TicketOrder>({
    resolver: zodResolver(ticketOrderSchema),
  });

  // TODO
  const totalCost = 56;

  async function formSubmit(data: TicketOrder) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Form submitted:', data);
    reset();
  }

  return (
    <div className={styles.ticketForm}>
      <form onSubmit={handleSubmit(formSubmit)}>
        <h2>Select Tickets</h2>
        {tickets.map((ticket) => (
          <TicketOption key={ticket.name} ticket={ticket} />
        ))}
        {Object.keys(errors).length > 0 && (
          <em style={{ color: 'red' }}>There are errors</em>
        )}
        <div className={styles.totalPricing}>
          <span>Total</span>
          <span>${totalCost}</span>
        </div>

        <section className={styles.formSection}>
          <input {...register('firstName')} placeholder="First Name" />
          <input {...register('lastName')} placeholder="Last Name" />
          <input
            className={styles.wideInput}
            {...register('address')}
            placeholder="Address"
          />
        </section>

        <h3>Payment Details</h3>
        <section className={styles.formSection}>
          <input
            className={styles.wideInput}
            {...register('ccNumber')}
            placeholder="0000 0000 0000 0000"
            type="number"
          />
          <input
            {...register('ccExpiration')}
            placeholder="MM / YY"
            type="number"
          />
          <input {...register('ccSecurity')} placeholder="CVV" type="number" />
        </section>

        <button type="submit" disabled={isSubmitting}>
          Get Tickets
        </button>
      </form>
    </div>
  );
}
