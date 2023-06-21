import React, { useState } from 'react';
import './App.scss';
import classNames from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const category = categoriesFromServer
    .find(categoryFromServer => product.categoryId === categoryFromServer.id); // find by product.categoryId
  const user = usersFromServer
    .find(userFromServer => userFromServer.id === category.ownerId); // find by category.ownerId

  return {
    ...product,
    category,
    user,
  };
});

export const App = () => {
  const [filteredUserName, setFilteredUserName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [query, setQuery] = useState('');

  const filterByNameHandler = (name) => {
    setFilteredUserName(name);
  };

  const filterByCategoryHandler = (title) => {
    if (selectedCategories.includes(title)) {
      // eslint-disable-next-line max-len
      setSelectedCategories(selectedCategories.filter(category => category !== title));

      return;
    }

    setSelectedCategories([...selectedCategories, title]);
  };

  const queryChangeHandler = (event) => {
    setQuery(event.target.value);
  };

  const resetFiltersHandler = () => {
    setFilteredUserName('');
    setSelectedCategories([]);
    setQuery('');
  };

  const filteredProducts = products
    // eslint-disable-next-line max-len
    .filter(product => product.user.name.toLowerCase().includes(filteredUserName.toLowerCase()))
    // eslint-disable-next-line max-len
    .filter(product => selectedCategories.length === 0 || selectedCategories.includes(product.category.title))
    .filter((product) => {
      const trimmedQuery = query.trim().toLowerCase();
      const { name, category, user } = product;

      return (
        name.toLowerCase().includes(trimmedQuery)
        || category.title.toLowerCase().includes(trimmedQuery)
        || user.name.toLowerCase().includes(trimmedQuery)
      );
    });

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => filterByNameHandler('')}
              >
                All
              </a>

              {usersFromServer.map((user) => {
                const { name, id } = user;
                const isSelected = name === filteredUserName;

                return (
                  <a
                    key={id}
                    data-cy="FilterUser"
                    href="#/"
                    onClick={() => filterByNameHandler(name)}
                    className={classNames({
                      'is-active': isSelected,
                    })}
                  >
                    {name}
                  </a>
                );
              })}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={queryChangeHandler}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                    onClick={() => setQuery('')}
                  />
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={classNames('button mr-2 my-1', {
                  'is-info': selectedCategories.length === 0,
                })}
                onClick={() => setSelectedCategories([])}
              >
                All
              </a>

              {categoriesFromServer.map((category) => {
                const { title } = category;
                const isSelected = selectedCategories.includes(title);

                return (
                  <a
                    data-cy="Category"
                    className={classNames('button mr-2 my-1', {
                      'is-info': isSelected,
                    })}
                    href="#/"
                    onClick={() => filterByCategoryHandler(title)}
                  >
                    {title}
                  </a>
                );
              })}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => resetFiltersHandler()}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-down" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-up" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length > 0
                ? (
                  filteredProducts.map((product) => {
                    const { name, user, category } = product;

                    return (
                      <tr data-cy="Product" key={product.id}>
                        <td
                          className="has-text-weight-bold"
                          data-cy="ProductId"
                        >
                          {product.id}
                        </td>
                        <td data-cy="ProductName">{name}</td>
                        <td data-cy="ProductCategory">
                          {category.icon}
                          {' '}
                          -
                          {' '}
                          {category.title}
                        </td>
                        <td data-cy="ProductUser" className="has-text-link">
                          {user.name}
                        </td>
                      </tr>
                    );
                  })
                )
                : `No products matching selected criteria`
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
