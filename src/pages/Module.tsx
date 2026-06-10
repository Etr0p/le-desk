import { useParams } from 'react-router-dom';
import { PageProvisoire } from './PageProvisoire';

export default function Module() {
  const { moduleId } = useParams();
  return (
    <PageProvisoire
      titre={`Module ${moduleId ?? ''}`}
      description="À venir : sommaire des chapitres du module, formules clés et état d'avancement."
    />
  );
}
