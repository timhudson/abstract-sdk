// @flow
import type {
  BranchDescriptor,
  Changeset,
  BranchCommitDescriptor,
  RequestOptions
} from "../types";
import Endpoint from "../endpoints/Endpoint";
import { wrap } from "../response";

const headers = {
  "Abstract-Api-Version": "19"
};

export default class Changesets extends Endpoint {
  async commit(
    descriptor: BranchCommitDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    const latestDescriptor = await this.client.descriptors.getLatestDescriptor(
      descriptor
    );

    return this.configureRequest<Promise<Changeset>>({
      api: async () => {
        const response = await this.apiRequest(
          `projects/${latestDescriptor.projectId}/branches/${latestDescriptor.branchId}/commits/${latestDescriptor.sha}/changeset`,
          { headers }
        );
        return wrap(response.changeset, response);
      },

      cli: async () => {
        const response = await this.cliRequest([
          "changeset",
          latestDescriptor.projectId,
          "--commit",
          latestDescriptor.sha,
          "--branch",
          latestDescriptor.branchId
        ]);
        return wrap(response.changeset, response);
      },

      requestOptions
    });
  }

  branch(descriptor: BranchDescriptor, requestOptions: RequestOptions = {}) {
    return this.configureRequest<Promise<Changeset>>({
      api: async () => {
        const response = await this.apiRequest(
          `projects/${descriptor.projectId}/branches/${descriptor.branchId}/changeset`,
          { headers }
        );
        return wrap(response.changeset, response);
      },

      cli: async () => {
        const response = await this.cliRequest([
          "changeset",
          descriptor.projectId,
          "--branch",
          descriptor.branchId
        ]);
        return wrap(response.changeset, response);
      },

      requestOptions
    });
  }
}
