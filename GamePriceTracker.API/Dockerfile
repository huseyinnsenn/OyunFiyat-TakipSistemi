FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src


COPY ["GamePriceTracker.API/*.csproj", "GamePriceTracker.API/"]
COPY ["GamePriceTracker.Application/*.csproj", "GamePriceTracker.Application/"]
COPY ["GamePriceTracker.Domain/*.csproj", "GamePriceTracker.Domain/"]
COPY ["GamePriceTracker.Infrastructure/*.csproj", "GamePriceTracker.Infrastructure/"]


RUN dotnet restore "GamePriceTracker.API/GamePriceTracker.API.csproj"


COPY . .
WORKDIR "/src/GamePriceTracker.API"
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "GamePriceTracker.API.dll"]