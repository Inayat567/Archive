import { useParams } from 'react-router-dom';
import FinishRegistration from 'components/auth/FinishRegistration';
import { useContext } from 'react';
import { UserContext } from 'common/context';

type Params = {
  uid: string;
}

export default function FinishRegistrationPage() {

  const { uid } = useParams<Params>();
  const { onFinishRegistration } = useContext<any>(UserContext);

  function finalize(){
    onFinishRegistration(uid);
  }

  return (
    <FinishRegistration userUid={uid} callback={finalize} />
  );
}