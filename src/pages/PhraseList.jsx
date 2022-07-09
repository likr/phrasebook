import { useRef, Suspense } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonProgressBar,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { add } from "ionicons/icons";
import { useAuth0 } from "@auth0/auth0-react";
import useSWRImmutable from "swr/immutable";
import { request } from "graphql-request";
import { mutate } from "swr";

function usePhrases() {
  const { getAccessTokenSilently } = useAuth0();
  const query = `query Phrases {
  phrases(offset: 0, limit: 10, order_by: {created_at: asc}) {
    id
    japanese
    english
  }
}`;
  const { data } = useSWRImmutable(
    "/phrases",
    async () => {
      const token = await getAccessTokenSilently();
      return request(
        "https://intense-cobra-61.hasura.app/v1/graphql",
        query,
        {},
        {
          Authorization: `Bearer ${token}`,
        }
      );
    },
    { suspense: true }
  );
  return data.phrases;
}

function PhraseItems() {
  const phrases = usePhrases();
  return (
    <>
      {phrases.map((phrase) => {
        return (
          <IonItem key={phrase.id}>
            <IonLabel>
              {phrase.japanese}
              <br />
              {phrase.english}
            </IonLabel>
          </IonItem>
        );
      })}
    </>
  );
}

export default function PhraseList() {
  const { getAccessTokenSilently } = useAuth0();
  const modal = useRef();
  const japaneseRef = useRef();
  const englishRef = useRef();

  function confirm() {
    modal.current?.dismiss(
      {
        japanese: japaneseRef.current?.value,
        english: englishRef.current?.value,
      },
      "confirm"
    );
  }

  async function onWillDismiss(event) {
    if (event.detail.role === "confirm") {
      const query = `mutation InsertPhrase($english: String, $japanese: String) {
  insert_phrases_one(object: {english: $english, japanese: $japanese}) {
    id
  }
}`;
      const token = await getAccessTokenSilently();
      await request(
        "https://intense-cobra-61.hasura.app/v1/graphql",
        query,
        event.detail.data,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      mutate("/phrases");
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>PhraseBook</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <Suspense fallback={<IonProgressBar type="indeterminate" />}>
            <PhraseItems />
          </Suspense>
        </IonList>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton id="open-modal">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <IonModal
          ref={modal}
          trigger="open-modal"
          onWillDismiss={(event) => onWillDismiss(event)}
        >
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={() => modal.current?.dismiss()}>
                  Cancel
                </IonButton>
              </IonButtons>
              <IonTitle>Welcome</IonTitle>
              <IonButtons slot="end">
                <IonButton strong onClick={() => confirm()}>
                  Confirm
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonItem>
              <IonLabel position="stacked">日本語</IonLabel>
              <IonInput ref={japaneseRef} type="text" />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">英語</IonLabel>
              <IonInput ref={englishRef} type="text" />
            </IonItem>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
}
