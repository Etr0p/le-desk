import { useParams } from 'react-router-dom';
import { PageProvisoire } from './PageProvisoire';

export default function Chapitre() {
  const { chapitreId } = useParams();
  return (
    <PageProvisoire
      titre={`Chapitre ${chapitreId ?? ''}`}
      description="À venir : le contenu du chapitre (MDX + KaTeX), les encadrés « Pour aller plus loin » et le checkpoint de fin."
    />
  );
}
