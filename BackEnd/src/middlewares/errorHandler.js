// Middleware de manejo de errores: captura y responde a errores de la aplicación.

$resourceGroup = "<nombre-del-resource-group-del-sql-server>"
$sqlServer = "<nombre-del-sql-server>"
$ips = @(
    "20.253.40.35",
    "20.253.40.43",
    "20.253.40.46",
    "20.253.40.62",
    "20.253.40.109",
    "20.253.40.111",
    "20.81.2.42",
    "20.81.3.47",
    "20.81.4.205",
    "20.81.6.155",
    "20.88.173.236",
    "20.241.184.130",
    "20.119.16.45"
)
for ($i = 0; $i -lt $ips.Count; $i++) {
    $ruleName = "appservice$($i+1)"
    az sql server firewall-rule create `
        --resource-group $resourceGroup `
        --server $sqlServer `
        --name $ruleName `
        --start-ip-address $($ips[$i]) `
        --end-ip-address $($ips[$i])
}