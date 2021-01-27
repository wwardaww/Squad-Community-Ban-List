import React, { Fragment } from 'react';
import { gql, useQuery } from '@apollo/client';

import { Card, CardBody, Container, Modal, ModalBody, ModalHeader, Table } from 'reactstrap';

import Layout from '../layout/layout.js';
import { AdvancedModal } from '../../components';

const organisationQuery = gql`
  query OrganisationGet($id: Int!) {
    organisation(id: $id) {
      id
      name
      discord

      banLists {
        id
        name
      }
    }
  }
`;

const QueryMultiple = (organisationId) => {
  const organisation = useQuery(organisationQuery, { variables: { id: parseInt(organisationId) } });
  console.log(organisation);
  //const players = useQuery(...);
  return { organisation };
};

export default function (props) {
  const { id } = props.match.params;
  const { organisation } = QueryMultiple(id);
  return (
    <Layout>
      <section className="section section-lg pt-lg-0 mt--200">
        <Container>
          <Card className="shadow border-0">
            <CardBody className="pt-5 pb-2 border-bottom">
              <div className="icon icon-shape bg-gradient-warning rounded-circle text-white mb-4">
                <i className="fa fa-question-circle" />
              </div>
              <h6 className="text-warning text-uppercase">Partner Organisation List</h6>
              <p className="description mt-2">
                View a list of our partner organisations and their ban lists.
              </p>
            </CardBody>
            <Table className="align-items-center table-flush" responsive>
              <thead className="thead-light">
                <tr>
                  <th>Organisation</th>
                  <th>Ban List</th>
                </tr>
              </thead>
              <tbody>
                {organisation.loading && (
                  <tr>
                    <td colSpan={2} className="text-center">
                      <div className="text-center mt-2 mb-3">Loading...</div>
                      <div className="btn-wrapper text-center">
                        <i className="fas fa-circle-notch fa-spin fa-4x" />
                      </div>
                    </td>
                  </tr>
                )}
                {organisation.error && (
                  <tr>
                    <td colSpan={2} className="text-center">
                      <div className="text-center mt-2 mb-2">Error!</div>
                      <div className="btn-wrapper text-center">
                        <i className="fas fa-exclamation-triangle fa-4x" />
                      </div>
                      <div className="text-center mt-2 mb-2">
                        Something went wrong. Sad times. {organisation.error.message}
                      </div>
                    </td>
                  </tr>
                )}
                {organisation.data && (
                  <tr>
                    {' '}
                    <td>arda{organisation.data.organisation?.name}</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card>
        </Container>
      </section>
    </Layout>
  );
}
