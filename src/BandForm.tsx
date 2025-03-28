interface Ticket {
  name: string;
  description: string;
}

interface Band {
  name: string;
  ticketTypes: Ticket[];
}

function BandForm({ band }: {band: Band}) {
  return (
    <div>
      <h1>{band.name}</h1>
      {band.ticketTypes.map((ticket: Ticket) => (
        <p>
          {ticket.name} - {ticket.description}
        </p>
      ))}
    </div>
  );
}

export default BandForm;
