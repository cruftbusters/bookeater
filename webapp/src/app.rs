use uuid::Uuid;
use yew::prelude::*;

#[derive(Clone, PartialEq)]
struct Transaction {
    id: Uuid,
}

#[function_component(App)]
pub fn app() -> Html {
    let transactions = use_state(|| vec![]);
    let on_create = {
        let transactions = transactions.clone();
        move |_| {
            let mut value = transactions.to_vec();
            value.push(Transaction { id: Uuid::new_v4() });
            transactions.set(value);
        }
    };
    html! {
        <main>
            <h1>{ "Transactions" }</h1>
            { transactions.iter().map(|transaction| html! { <TransactionView transaction={transaction.clone()} /> }).collect::<Html>() }
            <div>
                <button onclick={on_create}>{ "create" }</button>
            </div>
        </main>
    }
}

#[derive(Properties, PartialEq)]
pub struct TransactionViewProps {
    transaction: Transaction,
}

#[function_component(TransactionView)]
pub fn transaction_view(props: &TransactionViewProps) -> Html {
    let TransactionViewProps { transaction } = props;
    html! { <div>{ transaction.id }</div> }
}
