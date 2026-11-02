import { env } from "@/config/env";
import {
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  PaginationMode,
} from "@/constants/paginationConstant";
import { normalizeFetchErrorResponse } from "@/providers/normalizeFetchErrorResponse";
import { fetcher } from "@/utils/fetchUtils";
import type {
  BaseRecord,
  CustomParams,
  CustomResponse,
  DataProvider,
  DeleteOneParams,
} from "@refinedev/core";

type QueryParamValue = string | number | boolean | null | undefined;

export const dataProvider: DataProvider = {
  getApiUrl: () => env.apiUrl,

  getList: async ({ resource, pagination, filters, sorters, meta }) => {
    const params = new URLSearchParams();

    if (pagination && pagination.mode !== PaginationMode.Off) {
      const page =
        pagination.currentPage ??
        (pagination as { current?: number } | undefined)?.current ??
        1;
      params.append("page", page.toString());
      params.append(
        "perPage",
        Math.min(
          pagination.pageSize ?? DEFAULT_PAGE_SIZE,
          MAX_PAGE_SIZE,
        ).toString(),
      );
    }

    if (sorters && sorters.length > 0) {
      params.append("_sort", sorters.map((sorter) => sorter.field).join(","));
      params.append("_order", sorters.map((sorter) => sorter.order).join(","));
    }

    if (filters && filters.length > 0) {
      for (const filter of filters) {
        if ("field" in filter && filter.operator === "eq") {
          params.append(filter.field, String(filter.value));
        }
      }
    }

    const queryParams = meta?.queryParams ?? {};
    for (const key of Object.keys(
      queryParams as Record<string, QueryParamValue>,
    )) {
      params.append(key, queryParams[key]?.toString() ?? "");
    }

    const queryString = params.toString();
    const endpoint = queryString ? `${resource}?${queryString}` : resource;
    const response = await fetcher(endpoint);

    if (response.status < 200 || response.status > 299) {
      throw await normalizeFetchErrorResponse(response);
    }

    const data = await response.json();
    const list = Array.isArray(data) ? data : (data?.data ?? []);
    const total = Number(
      data?.paginatorInfo?.total ??
        data?.total ??
        (Array.isArray(list) ? list.length : 0),
    );
    const paginatorInfo = data?.paginatorInfo ?? [];

    return {
      data: list,
      total,
      paginatorInfo,
    };
  },

  getMany: async ({ resource, ids }) => {
    const params = new URLSearchParams();

    if (ids) {
      for (const id of ids) {
        params.append("id", id.toString());
      }
    }

    const queryString = params.toString();
    const endpoint = queryString ? `${resource}?${queryString}` : resource;
    const response = await fetcher(endpoint);

    if (response.status < 200 || response.status > 299) {
      throw await normalizeFetchErrorResponse(response);
    }

    const data = await response.json();
    const list = Array.isArray(data) ? data : (data?.data ?? []);

    return { data: list };
  },

  getOne: async ({ resource, id }) => {
    const response = await fetcher(`${resource}/${id}`);

    if (response.status < 200 || response.status > 299) {
      throw await normalizeFetchErrorResponse(response);
    }

    const data = await response.json();
    const record =
      data &&
      typeof data === "object" &&
      "data" in data &&
      !Array.isArray(data.data)
        ? data.data
        : data;

    return { data: record };
  },

  create: async ({ resource, variables }) => {
    const response = await fetcher(resource, {
      method: "POST",
      body: JSON.stringify(variables),
    });

    if (response.status < 200 || response.status > 299) {
      throw await normalizeFetchErrorResponse(response);
    }

    const data = await response.json();
    const record =
      data &&
      typeof data === "object" &&
      "data" in data &&
      !Array.isArray(data.data)
        ? data.data
        : data;

    return { data: record };
  },

  update: async ({ resource, id, variables, meta }) => {
    const response = await fetcher(`${resource}/${id}`, {
      method: meta?.method ?? "PUT",
      body: JSON.stringify(variables),
    });

    if (response.status < 200 || response.status > 299) {
      throw await normalizeFetchErrorResponse(response);
    }

    const data = await response.json();
    const record =
      data &&
      typeof data === "object" &&
      "data" in data &&
      !Array.isArray(data.data)
        ? data.data
        : data;

    return { data: record };
  },

  deleteOne: async <
    TData extends BaseRecord = BaseRecord,
    TVariables = Record<string, unknown>,
  >({
    resource,
    id,
  }: DeleteOneParams<TVariables>) => {
    const response = await fetcher(`${resource}/${id}`, {
      method: "DELETE",
    });

    if (response.status < 200 || response.status > 299) {
      throw await normalizeFetchErrorResponse(response);
    }

    const data = await response.json();

    return {
      data: { id } as TData,
      response: data,
    };
  },

  custom: async <
    TData extends BaseRecord = BaseRecord,
    TQuery = unknown,
    TPayload = unknown,
  >({
    url,
    method,
    payload,
    meta,
  }: CustomParams<TQuery, TPayload>) => {
    const upperMethod = method.toUpperCase();
    const canHaveBody =
      payload !== undefined && upperMethod !== "GET" && upperMethod !== "HEAD";

    if (meta?.action === "upload") {
      const { file } = payload as { file: File };
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (response.status < 200 || response.status > 299) {
        throw await normalizeFetchErrorResponse(response);
      }

      return { success: true } as unknown as CustomResponse<TData>;
    }

    if (meta?.action === "download") {
      const response = await fetcher(url, {
        method: upperMethod,
        ...(canHaveBody ? { body: JSON.stringify(payload) } : {}),
        headers: meta?.headers ?? {},
      });

      if (response.status < 200 || response.status > 299) {
        throw await normalizeFetchErrorResponse(response);
      }

      const data = await response.text();
      return { data } as unknown as CustomResponse<TData>;
    }

    if (meta?.action === "downloadBlob") {
      const response = await fetcher(url, {
        method: upperMethod,
        ...(canHaveBody ? { body: JSON.stringify(payload) } : {}),
        headers: meta?.headers ?? {},
      });

      if (response.status < 200 || response.status > 299) {
        throw await normalizeFetchErrorResponse(response);
      }

      const data = await response.blob();
      return { data } as unknown as CustomResponse<TData>;
    }

    let requestUrl = url;
    if (meta?.query) {
      const params = new URLSearchParams(
        meta.query as Record<string, string>,
      ).toString();
      requestUrl += requestUrl.includes("?") ? `&${params}` : `?${params}`;
    }

    const response = await fetcher(requestUrl, {
      method: upperMethod,
      ...(canHaveBody ? { body: JSON.stringify(payload) } : {}),
      headers: meta?.headers ?? {},
    });

    if (response.status < 200 || response.status > 299) {
      throw await normalizeFetchErrorResponse(response);
    }

    if (upperMethod === "HEAD") {
      return null as unknown as CustomResponse<TData>;
    }

    const data = await response.json();
    return { data };
  },
};
