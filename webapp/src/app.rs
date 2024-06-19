use uuid::Uuid;
use yew::prelude::*;

#[derive(Clone, PartialEq)]
struct Transaction {
    id: Uuid,
    note: AttrValue,
}

#[function_component(App)]
pub fn app() -> Html {
    let transactions: UseStateHandle<Vec<Transaction>> = use_state(|| vec![]);
    let on_update = Callback::from({
        let transactions = transactions.clone();
        move |update: Transaction| {
            let mut results = vec![];
            for transaction in transactions.to_vec() {
                if transaction.id == update.id {
                    results.push(update.clone());
                } else {
                    results.push(transaction.clone());
                }
            }
            transactions.set(results);
        }
    });
    let on_create = {
        let transactions = transactions.clone();
        move |_| {
            let mut results = transactions.to_vec();
            results.push(Transaction {
                id: Uuid::new_v4(),
                note: "".into(),
            });
            transactions.set(results);
        }
    };
    html! {
        <main>
            <h1>{ "Transactions" }</h1>
            { transactions.iter().map(|transaction| html! { <TransactionView on_update={on_update.clone()} transaction={transaction.clone()} /> }).collect::<Html>() }
            <div>
                <button onclick={on_create}>{ "create" }</button>
            </div>
        </main>
    }
}

#[derive(Properties, PartialEq)]
pub struct TransactionViewProps {
    transaction: Transaction,
    on_update: Callback<Transaction>,
}

#[function_component(TransactionView)]
pub fn transaction_view(props: &TransactionViewProps) -> Html {
    let TransactionViewProps {
        on_update,
        transaction,
    } = props;
    let on_update = Callback::from({
        let mut transaction = transaction.clone();
        transaction.note = "updated".into();

        let on_update = on_update.clone();
        move |_| {
            on_update.emit(transaction.clone());
        }
    });
    html! {
        <div>
            <div>{ "id: " }{ &transaction.id }</div>
            <div>{ "note: " }{ &transaction.note }</div>
            <button onclick={on_update.clone()}>{ "update" }</button>
        </div>
    }
}
