export interface Ticket {
  name: string;
  description: string;
}

export interface Band {
  name: string;
  ticketTypes: Ticket[];
}

function BandForm({ band }: { band: Band }) {
  return (
    <div>
      <h1>{band.name}</h1>
      {band.ticketTypes.map((ticket: Ticket) => (
        <p key={ticket.name}>
          {ticket.name} - {ticket.description}
        </p>
      ))}
    </div>
  );
}

export default BandForm;
