use uuid::Uuid;
use web_sys::wasm_bindgen::JsCast;
use web_sys::{EventTarget, HtmlInputElement};
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
            { transactions.iter().map(|transaction| html! {
                <TransactionView
                    key={transaction.id.to_string()}
                    on_update={on_update.clone()}
                    transaction={transaction.clone()}
                />
            }).collect::<Html>() }
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

    let note = use_state(|| transaction.note.clone());

    let on_change_note = Callback::from({
        let note = note.clone();
        move |e: InputEvent| {
            let target: EventTarget = e
                .target()
                .expect("Event should have a target when dispatched");
            note.set(target.unchecked_into::<HtmlInputElement>().value().into());
        }
    });

    use_effect_with_deps(
        {
            let transaction = transaction.clone();
            let note = note.clone();
            let on_update = on_update.clone();
            move |_| {
                let mut transaction = transaction.clone();
                transaction.note = (*note).clone();
                on_update.emit(transaction);
            }
        },
        note.clone(),
    );

    html! {
        <div>
            <div>{ "id: " }{ &transaction.id }</div>
            <div>
                { "note: " }
                <input oninput={on_change_note} value={(*note).clone()} />
            </div>
        </div>
    }
}
