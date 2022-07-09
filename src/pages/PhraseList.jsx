import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useAuth0 } from "@auth0/auth0-react";
import useSWRImmutable from "swr/immutable";
import { request } from "graphql-request";

function usePhrases() {
  const query = `query Phrases {
  phrases(offset: 0, limit: 10, order_by: {created_at: asc}) {
    japanese
    english
  }
}
`;
  const { getAccessTokenSilently, user } = useAuth0();
  console.log(user);
  const { data } = useSWRImmutable(query, async () => {
    const token = await getAccessTokenSilently();
    return request(
      "https://intense-cobra-61.hasura.app/v1/graphql",
      query,
      {},
      {
        Authorization: `Bearer ${token}`,
      }
    );
  });
  return data;
}

export default function PhraseList() {
  const phrases = usePhrases();
  console.log(phrases);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>PhraseBook</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>
            <IonLabel>hoge</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
}
