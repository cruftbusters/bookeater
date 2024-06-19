use yew::prelude::*;

#[derive(Clone)]
struct Transaction {}

#[function_component(App)]
pub fn app() -> Html {
    let transactions = use_state(|| vec![]);
    let on_create = {
        let transactions = transactions.clone();
        move |_| {
            let mut value = transactions.to_vec();
            value.push(Transaction {});
            transactions.set(value);
        }
    };
    html! {
        <main>
            <h1>{ "Transactions" }</h1>
            { transactions.iter().map(|_| html! { <TransactionView /> }).collect::<Html>() }
            <div>
                <button onclick={on_create}>{ "create" }</button>
            </div>
        </main>
    }
}

#[function_component(TransactionView)]
pub fn transaction_view() -> Html {
    html! { <div>{ "default transaction" }</div> }
}
