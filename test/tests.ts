import { ConflictResolution, DisputeResolutionPayload, VerificationResolutionPayload } from '@i3m/non-repudiation-library'
import { expect, request, use } from 'chai'
import chaiHttp from 'chai-http'
import { Server } from 'http'
import serverPromise from '../src'
import { server as serverConfig } from '../src/config'
import { OpenApiPaths } from '../types/openapi'

use(chaiHttp)

describe('Conflict-Resolver Service', function () {
  this.timeout(20000) // ms

  let server: Server

  const url = `http://localhost:${serverConfig.port}`

  before(async () => {
    server = await serverPromise
  })

  after((done) => {
    server.close((err) => {
      done(err)
    })
  })

  describe('Testing /verification', function () {
    const verificationRequest = 'eyJhbGciOiJFUzI1NiJ9.eyJwcm9vZlR5cGUiOiJyZXF1ZXN0IiwiaXNzIjoib3JpZyIsImRhdGFFeGNoYW5nZUlkIjoiU05oOXlLWGIyZWhsVkhSWUJJZWstemdaVWgybVNTbzFqcGxoN0lhLTR5USIsInBvciI6ImV5SmhiR2NpT2lKRlV6STFOaUo5LmV5SndjbTl2WmxSNWNHVWlPaUpRYjFJaUxDSnBjM01pT2lKa1pYTjBJaXdpWlhoamFHRnVaMlVpT25zaWIzSnBaeUk2SW50Y0ltRnNaMXdpT2x3aVJWTXlOVFpjSWl4Y0ltTnlkbHdpT2x3aVVDMHlOVFpjSWl4Y0ltdDBlVndpT2x3aVJVTmNJaXhjSW5oY0lqcGNJa0pxZW1ocVRrMXFRVkl0TFdwNmRqWmpRaTFQYVhSU2IwMURkbEpZVldaTVdUUmFhVEZZZVMwd1VtZGNJaXhjSW5sY0lqcGNJbnBUVjFKdU1VaENWV2MwUmpORE5tOWpZMUprUzNaMVUydDNNak5LUW1oWFIweHVkRU5zTVdwS2NqUmNJbjBpTENKa1pYTjBJam9pZTF3aVlXeG5YQ0k2WENKRlV6STFObHdpTEZ3aVkzSjJYQ0k2WENKUUxUSTFObHdpTEZ3aWEzUjVYQ0k2WENKRlExd2lMRndpZUZ3aU9sd2lWbGh6UW5WUFduZFdhbWh2WmtwV05HdEJhR0poTm5kdU1VVlpSSGRWU1d0bldHSXlabFp1VERoNFkxd2lMRndpZVZ3aU9sd2lhRFJtVERWUmRqUkZXWFEzV0dSTGNXUkplVEZhU25NMFgxRlhXVVJyV1RGNlZYcFRiMGsyTVU0M1dWd2lmU0lzSW1WdVkwRnNaeUk2SWtFeU5UWkhRMDBpTENKemFXZHVhVzVuUVd4bklqb2lSVk15TlRZaUxDSm9ZWE5vUVd4bklqb2lVMGhCTFRJMU5pSXNJbXhsWkdkbGNrTnZiblJ5WVdOMFFXUmtjbVZ6Y3lJNklqQjRPR1EwTURkaE1UY3lNall6TTJKa1pERmtZMll5TWpFME56UmlaVGRoTkRSak1EVmtOMk15WmlJc0lteGxaR2RsY2xOcFoyNWxja0ZrWkhKbGMzTWlPaUl3ZURFM1ltUXhNbU15TVRNMFlXWmpNV1kyWlRrek1ESmhOVE15WldabE16QmpNVGxpT1dVNU1ETWlMQ0p3YjI5VWIxQnZja1JsYkdGNUlqb3hNREF3TUN3aWNHOXZWRzlRYjNCRVpXeGhlU0k2TWpBd01EQXNJbkJ2YjFSdlUyVmpjbVYwUkdWc1lYa2lPakU0TURBd01Dd2lZMmx3YUdWeVlteHZZMnRFWjNOMElqb2lSREZpUjIxTWIwNVZhbmRrVDNGMFJ6aGpZa3B1VVhCNmEzZzFOMVJWWlRsSU1FWldaRWxxTlRoWk9DSXNJbUpzYjJOclEyOXRiV2wwYldWdWRDSTZJbGhWY0RnemJtcE1WVlk0V1UwdFZuWndaVmhpUVcxVE1rMVhRM2t3Y21ZNVZXZHViMWhDYm04dGIyTWlMQ0p6WldOeVpYUkRiMjF0YVhSdFpXNTBJam9pT0U1U1ptRkhhVVF6UldOcFUyNXFWa1l6ZWt0WVoxRlNjeTFTY1VwMlltdDVUbXBhVTFwVlNEZElaeUlzSW1sa0lqb2lVMDVvT1hsTFdHSXlaV2hzVmtoU1dVSkpaV3N0ZW1kYVZXZ3liVk5UYnpGcWNHeG9OMGxoTFRSNVVTSjlMQ0p3YjI4aU9pSmxlVXBvWWtkamFVOXBTa1pWZWtreFRtbEtPUzVsZVVwM1kyMDVkbHBzVWpWalIxVnBUMmxLVVdJd09HbE1RMHB3WXpOTmFVOXBTblpqYld4dVNXbDNhVnBZYUdwaFIwWjFXakpWYVU5dWMybGlNMHB3V25sSk5rbHVkR05KYlVaeldqRjNhVTlzZDJsU1ZrMTVUbFJhWTBscGVHTkpiVTU1Wkd4M2FVOXNkMmxWUXpCNVRsUmFZMGxwZUdOSmJYUXdaVlozYVU5c2QybFNWVTVqU1dsNFkwbHVhR05KYW5CalNXdEtjV1Z0YUhGVWF6RnhVVlpKZEV4WGNEWmthbHBxVVdreFVHRllVbE5pTURGRVpHeEtXVlpYV2sxWFZGSmhZVlJHV1dWVE1IZFZiV1JqU1dsNFkwbHViR05KYW5CalNXNXdWRll4U25WTlZXaERWbGRqTUZKcVRrUk9iVGxxV1RGS2ExTXpXakZWTW5RelRXcE9TMUZ0YUZoU01IaDFaRVZPYzAxWGNFdGphbEpqU1c0d2FVeERTbXRhV0U0d1NXcHZhV1V4ZDJsWlYzaHVXRU5KTmxoRFNrWlZla2t4VG14M2FVeEdkMmxaTTBveVdFTkpObGhEU2xGTVZFa3hUbXgzYVV4R2QybGhNMUkxV0VOSk5saERTa1pSTVhkcFRFWjNhV1ZHZDJsUGJIZHBWbXhvZWxGdVZsQlhibVJYWVcxb2RscHJjRmRPUjNSQ1lVZEthRTV1WkhWTlZWWmFVa2hrVmxOWGRHNVhSMGw1V214YWRWUkVhRFJaTVhkcFRFWjNhV1ZXZDJsUGJIZHBZVVJTYlZSRVZsSmthbEpHVjFoUk0xZEhVa3hqVjFKS1pWUkdZVk51VFRCWU1VWllWMVZTY2xkVVJqWldXSEJVWWpCck1rMVZORE5YVm5kcFpsTkpjMGx0Vm5WWk1FWnpXbmxKTmtsclJYbE9WRnBJVVRBd2FVeERTbnBoVjJSMVlWYzFibEZYZUc1SmFtOXBVbFpOZVU1VVdXbE1RMHB2V1ZoT2IxRlhlRzVKYW05cFZUQm9Ra3hVU1RGT2FVbHpTVzE0YkZwSFpHeGphMDUyWW01U2VWbFhUakJSVjFKclkyMVdlbU41U1RaSmFrSTBUMGRSTUUxRVpHaE5WR041VFdwWmVrMHlTbXRhUkVacldUSlplVTFxUlRCT2VsSnBXbFJrYUU1RVVtcE5SRlpyVGpKTmVWcHBTWE5KYlhoc1drZGtiR05zVG5CYU1qVnNZMnRHYTFwSVNteGpNMDFwVDJsSmQyVkVSVE5aYlZGNFRXMU5lVTFVVFRCWlYxcHFUVmRaTWxwVWEzcE5SRXBvVGxSTmVWcFhXbXhOZWtKcVRWUnNhVTlYVlRWTlJFMXBURU5LZDJJeU9WVmlNVUoyWTJ0U2JHSkhSalZKYW05NFRVUkJkMDFEZDJsalJ6bDJWa2M1VVdJelFrVmFWM2hvWlZOSk5rMXFRWGROUkVGelNXNUNkbUl4VW5aVk1sWnFZMjFXTUZKSFZuTlpXR3RwVDJwRk5FMUVRWGROUTNkcFdUSnNkMkZIVm5sWmJYaDJXVEowUlZvelRqQkphbTlwVWtSR2FWSXlNVTFpTURWV1lXNWthMVF6UmpCU2VtaHFXV3R3ZFZWWVFqWmhNMmN4VGpGU1ZscFViRWxOUlZwWFdrVnNjVTVVYUZwUFEwbHpTVzFLYzJJeVRuSlJNamwwWWxkc01HSlhWblZrUTBrMlNXeG9WbU5FWjNwaWJYQk5WbFpaTkZkVk1IUldibHAzV2xab2FWRlhNVlJOYXpGWVVUTnJkMk50V1RWV1YyUjFZakZvUTJKdE9IUmlNazFwVEVOS2VscFhUbmxhV0ZKRVlqSXhkR0ZZVW5SYVZ6VXdTV3B2YVU5Rk5WTmFiVVpJWVZWUmVsSlhUbkJWTWpWeFZtdFplbVZyZEZsYU1VWlRZM2t4VTJOVmNESlpiWFExVkcxd1lWVXhjRlpUUkdSSldubEpjMGx0Ykd0SmFtOXBWVEExYjA5WWJFeFhSMGw1V2xkb2MxWnJhRk5YVlVwS1dsZHpkR1Z0WkdGV1YyZDVZbFpPVkdKNlJuRmpSM2h2VGpCc2FFeFVValZWVTBvNVRFTktjRmxZVVdsUGFrVXlUWHByTTA5VVNUTk5SR3c1TG5WMU5XUkNka05YTTNveFZqWjNaV3N3Y1hSMGFuWTNhMmxmY1V4RFoySjZObUZ4U1dGMGJWVlhVWEptVTIxNE1qTkpRbFV3Um1aU1EwbEtSWFZyYkV4TVZ6VkVVVzR4UkhSVVUxTmtXbk5ZU2toM2REQjNJaXdpYVdGMElqb3hOak01TnpreU56QTVmUS5tZndBZjRlVVd0N040UEVPd3dHMjNRSEpFNXI3NW50ODNKMWhDVWdSNkVxRWk4dVlJN0t2QWpZdzdod2VpVHJqZ1NMT2w4NnlDT2lVSk9ZZko3OGZjQSIsInR5cGUiOiJ2ZXJpZmljYXRpb25SZXF1ZXN0IiwiaWF0IjoxNjM5NzkyNzU0fQ.0BaQBLgBautFNwzY9TrPKy1xEl4kMvvXqhGhJTi900GI2Yu5mdPSEQKQrV9UTGhCMrtDsGkBqQMC3DHW85QyJA'
    it('a complete non-repudiation data exchange should be verified', async function () {
      const res = await request(url)
        .post('/verification')
        .send({
          verificationRequest
        })
      console.log(res.body)
      const verificationResponse = res.body as OpenApiPaths.Verification.Post.Responses.$200
      const { payload } = await ConflictResolution.verifyResolution<VerificationResolutionPayload>(verificationResponse.signedResolution)
      expect(payload.resolution).to.equal('completed')
    })
  })

  describe('Dispute request to /dispute', function () {
    const disputeRequest = 'eyJhbGciOiJFUzI1NiJ9.eyJwcm9vZlR5cGUiOiJyZXF1ZXN0IiwiaXNzIjoiZGVzdCIsInBvciI6ImV5SmhiR2NpT2lKRlV6STFOaUo5LmV5SndjbTl2WmxSNWNHVWlPaUpRYjFJaUxDSnBjM01pT2lKa1pYTjBJaXdpWlhoamFHRnVaMlVpT25zaWIzSnBaeUk2SW50Y0ltRnNaMXdpT2x3aVJWTXlOVFpjSWl4Y0ltTnlkbHdpT2x3aVVDMHlOVFpjSWl4Y0ltdDBlVndpT2x3aVJVTmNJaXhjSW5oY0lqcGNJa0pxZW1ocVRrMXFRVkl0TFdwNmRqWmpRaTFQYVhSU2IwMURkbEpZVldaTVdUUmFhVEZZZVMwd1VtZGNJaXhjSW5sY0lqcGNJbnBUVjFKdU1VaENWV2MwUmpORE5tOWpZMUprUzNaMVUydDNNak5LUW1oWFIweHVkRU5zTVdwS2NqUmNJbjBpTENKa1pYTjBJam9pZTF3aVlXeG5YQ0k2WENKRlV6STFObHdpTEZ3aVkzSjJYQ0k2WENKUUxUSTFObHdpTEZ3aWEzUjVYQ0k2WENKRlExd2lMRndpZUZ3aU9sd2lWbGh6UW5WUFduZFdhbWh2WmtwV05HdEJhR0poTm5kdU1VVlpSSGRWU1d0bldHSXlabFp1VERoNFkxd2lMRndpZVZ3aU9sd2lhRFJtVERWUmRqUkZXWFEzV0dSTGNXUkplVEZhU25NMFgxRlhXVVJyV1RGNlZYcFRiMGsyTVU0M1dWd2lmU0lzSW1WdVkwRnNaeUk2SWtFeU5UWkhRMDBpTENKemFXZHVhVzVuUVd4bklqb2lSVk15TlRZaUxDSm9ZWE5vUVd4bklqb2lVMGhCTFRJMU5pSXNJbXhsWkdkbGNrTnZiblJ5WVdOMFFXUmtjbVZ6Y3lJNklqQjRPR1EwTURkaE1UY3lNall6TTJKa1pERmtZMll5TWpFME56UmlaVGRoTkRSak1EVmtOMk15WmlJc0lteGxaR2RsY2xOcFoyNWxja0ZrWkhKbGMzTWlPaUl3ZURFM1ltUXhNbU15TVRNMFlXWmpNV1kyWlRrek1ESmhOVE15WldabE16QmpNVGxpT1dVNU1ETWlMQ0p3YjI5VWIxQnZja1JsYkdGNUlqb3hNREF3TUN3aWNHOXZWRzlRYjNCRVpXeGhlU0k2TWpBd01EQXNJbkJ2YjFSdlUyVmpjbVYwUkdWc1lYa2lPakU0TURBd01Dd2lZMmx3YUdWeVlteHZZMnRFWjNOMElqb2lSREZpUjIxTWIwNVZhbmRrVDNGMFJ6aGpZa3B1VVhCNmEzZzFOMVJWWlRsSU1FWldaRWxxTlRoWk9DSXNJbUpzYjJOclEyOXRiV2wwYldWdWRDSTZJbGhWY0RnemJtcE1WVlk0V1UwdFZuWndaVmhpUVcxVE1rMVhRM2t3Y21ZNVZXZHViMWhDYm04dGIyTWlMQ0p6WldOeVpYUkRiMjF0YVhSdFpXNTBJam9pT0U1U1ptRkhhVVF6UldOcFUyNXFWa1l6ZWt0WVoxRlNjeTFTY1VwMlltdDVUbXBhVTFwVlNEZElaeUlzSW1sa0lqb2lVMDVvT1hsTFdHSXlaV2hzVmtoU1dVSkpaV3N0ZW1kYVZXZ3liVk5UYnpGcWNHeG9OMGxoTFRSNVVTSjlMQ0p3YjI4aU9pSmxlVXBvWWtkamFVOXBTa1pWZWtreFRtbEtPUzVsZVVwM1kyMDVkbHBzVWpWalIxVnBUMmxLVVdJd09HbE1RMHB3WXpOTmFVOXBTblpqYld4dVNXbDNhVnBZYUdwaFIwWjFXakpWYVU5dWMybGlNMHB3V25sSk5rbHVkR05KYlVaeldqRjNhVTlzZDJsU1ZrMTVUbFJhWTBscGVHTkpiVTU1Wkd4M2FVOXNkMmxWUXpCNVRsUmFZMGxwZUdOSmJYUXdaVlozYVU5c2QybFNWVTVqU1dsNFkwbHVhR05KYW5CalNXdEtjV1Z0YUhGVWF6RnhVVlpKZEV4WGNEWmthbHBxVVdreFVHRllVbE5pTURGRVpHeEtXVlpYV2sxWFZGSmhZVlJHV1dWVE1IZFZiV1JqU1dsNFkwbHViR05KYW5CalNXNXdWRll4U25WTlZXaERWbGRqTUZKcVRrUk9iVGxxV1RGS2ExTXpXakZWTW5RelRXcE9TMUZ0YUZoU01IaDFaRVZPYzAxWGNFdGphbEpqU1c0d2FVeERTbXRhV0U0d1NXcHZhV1V4ZDJsWlYzaHVXRU5KTmxoRFNrWlZla2t4VG14M2FVeEdkMmxaTTBveVdFTkpObGhEU2xGTVZFa3hUbXgzYVV4R2QybGhNMUkxV0VOSk5saERTa1pSTVhkcFRFWjNhV1ZHZDJsUGJIZHBWbXhvZWxGdVZsQlhibVJYWVcxb2RscHJjRmRPUjNSQ1lVZEthRTV1WkhWTlZWWmFVa2hrVmxOWGRHNVhSMGw1V214YWRWUkVhRFJaTVhkcFRFWjNhV1ZXZDJsUGJIZHBZVVJTYlZSRVZsSmthbEpHVjFoUk0xZEhVa3hqVjFKS1pWUkdZVk51VFRCWU1VWllWMVZTY2xkVVJqWldXSEJVWWpCck1rMVZORE5YVm5kcFpsTkpjMGx0Vm5WWk1FWnpXbmxKTmtsclJYbE9WRnBJVVRBd2FVeERTbnBoVjJSMVlWYzFibEZYZUc1SmFtOXBVbFpOZVU1VVdXbE1RMHB2V1ZoT2IxRlhlRzVKYW05cFZUQm9Ra3hVU1RGT2FVbHpTVzE0YkZwSFpHeGphMDUyWW01U2VWbFhUakJSVjFKclkyMVdlbU41U1RaSmFrSTBUMGRSTUUxRVpHaE5WR041VFdwWmVrMHlTbXRhUkVacldUSlplVTFxUlRCT2VsSnBXbFJrYUU1RVVtcE5SRlpyVGpKTmVWcHBTWE5KYlhoc1drZGtiR05zVG5CYU1qVnNZMnRHYTFwSVNteGpNMDFwVDJsSmQyVkVSVE5aYlZGNFRXMU5lVTFVVFRCWlYxcHFUVmRaTWxwVWEzcE5SRXBvVGxSTmVWcFhXbXhOZWtKcVRWUnNhVTlYVlRWTlJFMXBURU5LZDJJeU9WVmlNVUoyWTJ0U2JHSkhSalZKYW05NFRVUkJkMDFEZDJsalJ6bDJWa2M1VVdJelFrVmFWM2hvWlZOSk5rMXFRWGROUkVGelNXNUNkbUl4VW5aVk1sWnFZMjFXTUZKSFZuTlpXR3RwVDJwRk5FMUVRWGROUTNkcFdUSnNkMkZIVm5sWmJYaDJXVEowUlZvelRqQkphbTlwVWtSR2FWSXlNVTFpTURWV1lXNWthMVF6UmpCU2VtaHFXV3R3ZFZWWVFqWmhNMmN4VGpGU1ZscFViRWxOUlZwWFdrVnNjVTVVYUZwUFEwbHpTVzFLYzJJeVRuSlJNamwwWWxkc01HSlhWblZrUTBrMlNXeG9WbU5FWjNwaWJYQk5WbFpaTkZkVk1IUldibHAzV2xab2FWRlhNVlJOYXpGWVVUTnJkMk50V1RWV1YyUjFZakZvUTJKdE9IUmlNazFwVEVOS2VscFhUbmxhV0ZKRVlqSXhkR0ZZVW5SYVZ6VXdTV3B2YVU5Rk5WTmFiVVpJWVZWUmVsSlhUbkJWTWpWeFZtdFplbVZyZEZsYU1VWlRZM2t4VTJOVmNESlpiWFExVkcxd1lWVXhjRlpUUkdSSldubEpjMGx0Ykd0SmFtOXBWVEExYjA5WWJFeFhSMGw1V2xkb2MxWnJhRk5YVlVwS1dsZHpkR1Z0WkdGV1YyZDVZbFpPVkdKNlJuRmpSM2h2VGpCc2FFeFVValZWVTBvNVRFTktjRmxZVVdsUGFrVXlUWHByTTA5VVNUTk5SR3c1TG5WMU5XUkNka05YTTNveFZqWjNaV3N3Y1hSMGFuWTNhMmxmY1V4RFoySjZObUZ4U1dGMGJWVlhVWEptVTIxNE1qTkpRbFV3Um1aU1EwbEtSWFZyYkV4TVZ6VkVVVzR4UkhSVVUxTmtXbk5ZU2toM2REQjNJaXdpYVdGMElqb3hOak01TnpreU56QTVmUS5tZndBZjRlVVd0N040UEVPd3dHMjNRSEpFNXI3NW50ODNKMWhDVWdSNkVxRWk4dVlJN0t2QWpZdzdod2VpVHJqZ1NMT2w4NnlDT2lVSk9ZZko3OGZjQSIsInR5cGUiOiJkaXNwdXRlUmVxdWVzdCIsImNpcGhlcmJsb2NrIjoiZXlKaGJHY2lPaUprYVhJaUxDSmxibU1pT2lKQk1qVTJSME5OSW4wLi5fQXpkaF91ZG9neHQxVHV0LllOZHpmNjJEY3ZIQkRVSnhLaGFHVkw2R3ptNExiVXp4bVZaTi1kSEN4M2xXWTFNUldEelVpZWptaUtGbVJmQ3JrZC1jbThWYXhhM184NXZlUXZuYjhrRFQ0dGRXcmlZTUw0TGx4THowM0dUSVByLVFhZDdRSHl0dHVCQTFpb0xub2xfSWZRWjduNGNTLUxlazRfSlRYRm5IQU4xUldIZ2cxQ1RjYWhtNlVNTkt0UmtVMjlkaXUzXzRGSklOeF9xVVpuTzJnTkcxMVJVSXZGaldwQ3ZUakE3aXRUNVZkdk9yR2hEaE9YSGl6V2FtUTNHM3hGQndIbFJMTFUwTWh1VUExU1BXVVd1aXg4a0hVT3lwN0RQMktzdXR1bTlOUG03MEI4QnJua0xpMVRQSFpTSlAyS0YxVDhlU1E0cmZuQ1E0bUM3aElrT1JZRnczc1VZRnpDUVF2Zy5VcllaVkRDQ2tSQUF6eG5qMmI0THFnIiwiaWF0IjoxNjM5NzkyNzU0LCJkYXRhRXhjaGFuZ2VJZCI6IlNOaDl5S1hiMmVobFZIUllCSWVrLXpnWlVoMm1TU28xanBsaDdJYS00eVEifQ.votEono3u7FJ9-te5zlLnltbk9tEp25vk2BmTm2Qz438_WsHEzXYonvnkS7bue76EW4xhYoeMy81SJfpFNdJaA'
    it(`POST ${url}/dispute should be denied if the consumer's dispute req is properly verified by the CRS and decryption works`, async function () {
      const res = await request(url)
        .post('/dispute')
        .send({
          disputeRequest
        })
      console.log(res.body)
      const disputeResponse = res.body as OpenApiPaths.Dispute.Post.Responses.$200
      const { payload } = await ConflictResolution.verifyResolution<DisputeResolutionPayload>(disputeResponse.signedResolution)
      expect(payload.resolution).to.equal('denied')
    })
  })
})
