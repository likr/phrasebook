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

export default function PhraseList() {
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
