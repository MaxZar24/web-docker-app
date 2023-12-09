export default function Orders () {
    return (
        <div className="bg-white p-3 rounded-bottom">
            <h1>Orders</h1>
            <table className="table">
                <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Name</th>
                    <th scope="col">Date</th>
                    <th scope="col">Category</th>
                    <th scope="col">Price</th>
                    <th scope="col">Amount</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <th scope="row">1</th>
                    <td>Pen</td>
                    <td>25.11.2023</td>
                    <td>Stationery</td>
                    <td>5$</td>
                    <td>10</td>
                </tr>
                </tbody>
            </table>
        </div>
    )
}