import React from "react";
import Table from "react-bootstrap/Table";

//TODO ping the API to get the data
//TODO set up toggles to toggle between the different markets

const MainDashboard = () => {
  return (
    <Table striped>
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Name</th>
          <th>Price</th>
          <th>Change</th>
          <th>Volume</th>
          <th>Market cap</th>
        </tr>
      </thead>
      {/* To map out the table body*/}
      <tbody>
        <tr>
          <td>1</td>
          <td>Mark</td>
          <td>Otto</td>
          <td>@mdo</td>
          <td>@mdo</td>
          <td>@mdo</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Jacob</td>
          <td>Thornton</td>
          <td>@fat</td>
          <td>@fat</td>
          <td>@fat</td>
        </tr>
      </tbody>
    </Table>
  );
};

export default MainDashboard;
