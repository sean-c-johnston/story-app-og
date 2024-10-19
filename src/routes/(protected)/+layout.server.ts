/**
 * This file is necessary to ensure protection of all routes in the `(protected)`
 * directory.
 *
 * Having a +layout.server.ts makes the routes in this directory _dynamic_ routes, which
 * send a server request, and thus trigger `hooks.server.ts`.
 **/