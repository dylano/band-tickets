import { Band } from './BandForm'; // Importing Band type from BandForm
import styles from './BandList.module.css';

export interface BandListProps {
  bands: Band[];
  setBandIndex: (index: number) => void;
}

function BandList({ bands, setBandIndex }: BandListProps) {
  return (
    <nav className={styles.BandList}>
      <h3>Upcoming shows</h3>
      {bands.map((band: Band, idx) => (
        <button key={band.name} onClick={() => setBandIndex(idx)}>
          {band.name}
        </button>
      ))}
    </nav>
  );
}

export default BandList;
