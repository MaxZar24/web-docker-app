import {useState, useEffect} from "react";
import axios from "axios";

export default function Orders({user}) {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
            const fetchData = async () => {
                console.log(user);
                try {
                    const response = await axios.get('/get-orders', {
                        params: {
                            user: user,
                        },
                    });
                    setOrders(response.data);
                    console.log(response.data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
            fetchData();
        }, []
    )


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