import {
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
} from "@ionic/react";
import AddPhraseModal from "./AddPhraseModal";

const listPhrase = () => {
  return db
    .collection("phrases")
    .list({ order: "-updated" })
    .then(({ data: phrases }) => phrases);
};

const addPhrase = (result) => {
  return db
    .collection("phrases")
    .create(
      Object.assign({}, result, {
        created: new Date(),
        updated: new Date(),
      })
    )
    .then(() => listPhrase());
};

const syncPhrase = (token) => {
  return db
    .collection("phrases")
    .sync({
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(() => listPhrase());
};

class PhraseList extends React.Component {
  constructor() {
    super();
    this.state = {
      showModal: false,
      phrases: [],
    };
  }

  componentDidMount() {
    listPhrase().then((phrases) => {
      this.setState({ phrases });
    });
    if (this.props.token) {
      syncPhrase(this.props.token).then((phrases) => {
        this.setState({ phrases });
      });
    }
  }

  render() {
    const { phrases, showModal } = this.state;

    return (
      <>
        <IonContent padding>
          <IonList>
            {phrases.map((phrase) => {
              const { id, japanese, english, created } = phrase;
              return (
                <IonItem key={id}>
                  <IonLabel text-wrap>
                    <p>{created.toString()}</p>
                    <p>{japanese}</p>
                    <p>{english}</p>
                  </IonLabel>
                </IonItem>
              );
            })}
          </IonList>
        </IonContent>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton
            onClick={() => {
              this.setState({
                showModal: true,
              });
            }}
          >
            <IonIcon name="add" />
          </IonFabButton>
        </IonFab>
        <AddPhraseModal
          isOpen={showModal}
          addPhrase={(result) => {
            addPhrase(result).then((phrases) => {
              this.setState({
                phrases,
              });
              if (this.props.token) {
                syncPhrase(this.props.token).then((phrases) => {
                  this.setState({
                    phrases,
                  });
                });
              }
            });
          }}
          onDidDismiss={() => {
            this.setState({
              showModal: false,
            });
          }}
        />
      </>
    );
  }
}

export default PhraseList;
