import Link from "next/link";
import { parseUndefinedValue } from "../../utils/value-parser";

const ItemComponent = ({ item }) => {
  if (item.type === "link") {
    return (
      <Link href={item.href} className="nav-link">
        {parseUndefinedValue(item.value)}
      </Link>
    );
  }
  return item.value;
};

const TableHeader = ({ dataHeaders }) => {
  if (!dataHeaders) {
    return null;
  }
  return (
    <thead>
      <tr>
        {dataHeaders?.map((header) => (
          <th key={header} scope="col">
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
};

const TableContent = ({ data, dataMapper, rowActions }) => {
  return (
    <tbody>
      {data?.map((data) => {
        const mappedData = dataMapper(data);
        return (
          <tr key={data.id}>
            {Object.entries(mappedData).map(([key, item]) => (
              <td key={key}>
                <ItemComponent item={item} />
              </td>
            ))}
            {false && (
              <td>
                <div className="d-flex justify-content-end">
                  {rowActions?.map(({ label, href }) => (
                    <Link key={label} className="btn btn-primary mx-1">
                      {label}
                    </Link>
                  ))}
                </div>
              </td>
            )}
          </tr>
        );
      })}
    </tbody>
  );
};

const TableComponent = ({ data, dataHeaders, dataMapper, rowActions }) => {
  return (
    <table className="table table-striped">
      <TableHeader dataHeaders={dataHeaders} />
      <TableContent data={data} dataMapper={dataMapper} />
    </table>
  );
};
export default TableComponent;
