import { useEffect, useState, useCallback } from 'react';
import { useForm, UseFormRegister } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Ticket } from './Concert';
import styles from './TicketForm.module.css';

const MAX_TICKET_QTY = 6;

const ticketOrderSchema = z.object({
  tickets: z.record(z.string(), z.number().min(0).max(MAX_TICKET_QTY)),
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  address: z.string().min(1, 'Required'),
  ccNumber: z.string().min(1, 'Required'),
  ccExpiration: z.string().min(5, 'Required'),
  ccSecurity: z.string().min(3, 'Required'),
});
export type TicketOrder = z.infer<typeof ticketOrderSchema>;

function TicketOption({
  ticket,
  register,
  updateTicketOrder,
}: {
  ticket: Ticket;
  register: UseFormRegister<TicketOrder>;
  updateTicketOrder: (order: { type: string; quantity: number }) => void;
}) {
  const price = `$${ticket.cost / 100}`;

  function processQuantityChange(
    e: React.ChangeEvent<HTMLInputElement>,
    ticket: Ticket
  ) {
    updateTicketOrder({ type: ticket.type, quantity: Number(e.target.value) });
  }

  return (
    <div className={styles.ticketOption}>
      <div>
        <h4>{ticket.name}</h4>
        <p>{ticket.description}</p>
        <h4>{price}</h4>
      </div>
      <div>
        <input
          type="number"
          min={0}
          max={MAX_TICKET_QTY}
          {...register(`tickets.${ticket.type}`, { valueAsNumber: true })}
          onChange={(e) => processQuantityChange(e, ticket)}
        />
      </div>
    </div>
  );
}

export function TicketForm({ tickets }: { tickets: Ticket[] }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<TicketOrder>({
    resolver: zodResolver(ticketOrderSchema),
  });

  const [ticketQuantities, setTicketQuantities] = useState<
    Record<string, number>
  >({});

  const initializeForm = useCallback(() => {
    reset();
    tickets.forEach((ticket) => setValue(`tickets.${ticket.type}`, 0));
    setTicketQuantities({});
  }, [reset, tickets, setValue]);

  // Set initial values for ticket quantities
  useEffect(() => {
    initializeForm();
    return () => setTicketQuantities({});
  }, [initializeForm, setValue]);

  function updateTicketOrder({
    type,
    quantity,
  }: {
    type: string;
    quantity: number;
  }) {
    setTicketQuantities((prev) => ({ ...prev, [type]: quantity }));
  }

  function getTotalTicketCount() {
    return Object.values(ticketQuantities).reduce((acc, val) => acc + val, 0);
  }

  function getTotalCost() {
    return Object.keys(ticketQuantities).reduce((acc, key) => {
      const ticket = tickets.find((t) => t.type === key);
      return ticket ? acc + ticket.cost * (ticketQuantities[key] / 100) : acc;
    }, 0);
  }

  async function formSubmit(data: TicketOrder) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Form submitted:', data);
    initializeForm();
  }

  function buildErrorString() {
    return Object.entries(errors).reduce((acc, [key, { message }]) => {
      return `${acc}${key}: ${message}; `;
    }, '');
  }

  const errorString = buildErrorString();

  return (
    <div className={styles.ticketForm}>
      <form onSubmit={handleSubmit(formSubmit)}>
        <h2>Select Tickets</h2>
        {tickets.map((ticket) => (
          <TicketOption
            key={ticket.name}
            ticket={ticket}
            register={register}
            updateTicketOrder={updateTicketOrder}
          />
        ))}
        <div className={styles.totalPricing}>
          <span>Total</span>
          <span>${getTotalCost()}</span>
        </div>

        {errorString && <em style={{ color: 'red' }}>Error: {errorString}</em>}

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
          <input {...register('ccExpiration')} placeholder="MM / YY" />
          <input {...register('ccSecurity')} placeholder="CVV" type="number" />
        </section>

        <button
          type="submit"
          disabled={isSubmitting || getTotalTicketCount() === 0}
        >
          Get Tickets
        </button>
      </form>
    </div>
  );
}
