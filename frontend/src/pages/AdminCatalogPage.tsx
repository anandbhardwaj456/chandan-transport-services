import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { api, getApiErrorMessage } from '../services/api';

type CatalogTab = 'overview' | 'drivers' | 'routes' | 'vehicles' | 'pricing';

type DriverItem = {
  _id: string;
  name: string;
  phone: string;
  availabilityStatus?: string;
  licenseVerified?: boolean;
};

type RouteItem = {
  _id: string;
  origin: string;
  destination: string;
  status?: string;
  routeType?: string;
};

type VehicleItem = {
  _id: string;
  category: string;
  passengerCapacity?: number;
  luggageCapacity?: number;
  active?: boolean;
};

type PricingItem = {
  _id: string;
  name: string;
  vehicleCategory?: string;
  pricingModel?: string;
  baseFare?: number;
  perKmRate?: number;
  active?: boolean;
  verified?: boolean;
  corporateRates?: {
    eightHoursEightyKm?: number;
    twelveHoursOneTwentyKm?: number;
    outstationPerKm?: number;
  };
  additionalChargePolicy?: {
    extraHour?: number;
    extraKmPerKm?: number;
    tolls?: string;
    parking?: string;
    taxes?: string;
    minimumOutstationKmPerDay?: number;
  };
};

type CatalogState = {
  drivers: DriverItem[];
  routes: RouteItem[];
  vehicles: VehicleItem[];
  pricing: PricingItem[];
};

const optionalNumber = (value: string | number) => value === '' ? undefined : Number(value);

const tabs: { key: CatalogTab; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'drivers', label: 'Drivers' },
  { key: 'routes', label: 'Routes' },
  { key: 'vehicles', label: 'Vehicles' },
  { key: 'pricing', label: 'Pricing' },
];

const EMPTY_CATALOG: CatalogState = {
  drivers: [],
  routes: [],
  vehicles: [],
  pricing: [],
};

const DEFAULT_FORM_DATA = {
  drivers: {
    name: '',
    phone: '',
    availabilityStatus: 'available',
    licenseVerified: true,
  },
  routes: {
    origin: '',
    destination: '',
    routeType: 'one_way',
    status: 'active',
  },
  vehicles: {
    category: '',
    description: '',
    passengerCapacity: 4,
    luggageCapacity: 0,
    pricingModel: 'per_km',
  },
  pricing: {
    name: '',
    vehicleCategory: '',
    pricingModel: 'per_km',
    baseFare: 0,
    perKmRate: 0,
    active: true,
    verified: false,
    eightHoursEightyKm: '',
    twelveHoursOneTwentyKm: '',
    outstationPerKm: '',
    extraHour: '',
    extraKmPerKm: '',
    tolls: '',
    parking: '',
    taxes: '',
    minimumOutstationKmPerDay: '',
  },
};

type CatalogFormData = {
  drivers: typeof DEFAULT_FORM_DATA.drivers;
  routes: typeof DEFAULT_FORM_DATA.routes;
  vehicles: typeof DEFAULT_FORM_DATA.vehicles;
  pricing: {
    name: string;
    vehicleCategory: string;
    pricingModel: string;
    baseFare: number;
    perKmRate: number;
    active: boolean;
    verified: boolean;
    eightHoursEightyKm: string | number;
    twelveHoursOneTwentyKm: string | number;
    outstationPerKm: string | number;
    extraHour: string | number;
    extraKmPerKm: string | number;
    tolls: string;
    parking: string;
    taxes: string;
    minimumOutstationKmPerDay: string | number;
  };
};

const AdminCatalogPage = () => {
  const [tab, setTab] = useState<CatalogTab>('overview');
  const [catalog, setCatalog] = useState<CatalogState>(EMPTY_CATALOG);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CatalogFormData>(DEFAULT_FORM_DATA);
  const [editingPricingId, setEditingPricingId] = useState('');

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      const [driversResponse, routesResponse, vehiclesResponse, pricingResponse] = await Promise.all([
        api.get('/admin/drivers'),
        api.get('/admin/routes'),
        api.get('/admin/vehicles'),
        api.get('/admin/fare-rules'),
      ]);

      setCatalog({
        drivers: driversResponse.data?.data ?? [],
        routes: routesResponse.data?.data ?? [],
        vehicles: vehiclesResponse.data?.data ?? [],
        pricing: pricingResponse.data?.data ?? [],
      });
      setError('');
    } catch (apiError: any) {
      const message = apiError?.response?.data?.message ?? 'Unable to load the catalog at the moment.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const updateFormField = (section: keyof typeof DEFAULT_FORM_DATA, field: string, value: string | number | boolean) => {
    setFormData((previous) => ({
      ...previous,
      [section]: {
        ...previous[section],
        [field]: value,
      },
    } as CatalogFormData));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const endpointMap: Record<CatalogTab, string> = {
        overview: '',
        drivers: '/admin/drivers',
        routes: '/admin/routes',
        vehicles: '/admin/vehicles',
        pricing: '/admin/fare-rules',
      };

      const payloadMap = {
        drivers: {
          name: formData.drivers.name,
          phone: formData.drivers.phone,
          availabilityStatus: formData.drivers.availabilityStatus,
          licenseVerified: Boolean(formData.drivers.licenseVerified),
        },
        routes: {
          origin: formData.routes.origin,
          destination: formData.routes.destination,
          routeType: formData.routes.routeType,
          status: formData.routes.status,
        },
        vehicles: {
          category: formData.vehicles.category,
          description: formData.vehicles.description,
          passengerCapacity: Number(formData.vehicles.passengerCapacity),
          luggageCapacity: Number(formData.vehicles.luggageCapacity),
          pricingModel: formData.vehicles.pricingModel,
          active: true,
        },
        pricing: {
          name: formData.pricing.name,
          vehicleCategory: formData.pricing.vehicleCategory,
          pricingModel: formData.pricing.pricingModel,
          baseFare: Number(formData.pricing.baseFare),
          perKmRate: Number(formData.pricing.perKmRate),
          active: Boolean(formData.pricing.active),
          verified: Boolean(formData.pricing.verified),
          corporateRates: {
            eightHoursEightyKm: optionalNumber(formData.pricing.eightHoursEightyKm),
            twelveHoursOneTwentyKm: optionalNumber(formData.pricing.twelveHoursOneTwentyKm),
            outstationPerKm: optionalNumber(formData.pricing.outstationPerKm),
          },
          additionalChargePolicy: {
            extraHour: optionalNumber(formData.pricing.extraHour),
            extraKmPerKm: optionalNumber(formData.pricing.extraKmPerKm),
            tolls: formData.pricing.tolls,
            parking: formData.pricing.parking,
            taxes: formData.pricing.taxes,
            minimumOutstationKmPerDay: optionalNumber(formData.pricing.minimumOutstationKmPerDay),
          },
        },
      };

      const payload = payloadMap[tab as keyof typeof payloadMap];
      const endpoint = endpointMap[tab];

      if (!endpoint || !payload) {
        throw new Error('Please select a catalog section to save.');
      }

      if (tab === 'pricing' && editingPricingId) {
        await api.patch(`${endpoint}/${editingPricingId}`, payload);
        setEditingPricingId('');
      } else {
        await api.post(endpoint, payload);
      }
      setFormData(DEFAULT_FORM_DATA);
      await fetchCatalog();
    } catch (apiError: any) {
      const message = apiError?.response?.data?.message ?? apiError?.message ?? 'Unable to create this catalog entry.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    void fetchCatalog();
  }, []);

  const activeItems = useMemo(() => {
    if (tab === 'overview') {
      return [
        ...catalog.drivers.map((item) => ({ ...item, section: 'driver' })),
        ...catalog.routes.map((item) => ({ ...item, section: 'route' })),
        ...catalog.vehicles.map((item) => ({ ...item, section: 'vehicle' })),
        ...catalog.pricing.map((item) => ({ ...item, section: 'pricing' })),
      ];
    }
    if (tab === 'drivers') return catalog.drivers;
    if (tab === 'routes') return catalog.routes;
    if (tab === 'vehicles') return catalog.vehicles;
    return catalog.pricing;
  }, [catalog, tab]);

  const editPricing = (item: PricingItem) => {
    setTab('pricing');
    setEditingPricingId(item._id);
    setFormData((previous) => ({
      ...previous,
      pricing: {
        ...previous.pricing,
        name: item.name,
        vehicleCategory: item.vehicleCategory ?? '',
        pricingModel: item.pricingModel ?? 'per_km',
        baseFare: item.baseFare ?? 0,
        perKmRate: item.perKmRate ?? 0,
        active: item.active ?? false,
        verified: item.verified ?? false,
        eightHoursEightyKm: item.corporateRates?.eightHoursEightyKm ?? '',
        twelveHoursOneTwentyKm: item.corporateRates?.twelveHoursOneTwentyKm ?? '',
        outstationPerKm: item.corporateRates?.outstationPerKm ?? '',
        extraHour: item.additionalChargePolicy?.extraHour ?? '',
        extraKmPerKm: item.additionalChargePolicy?.extraKmPerKm ?? '',
        tolls: item.additionalChargePolicy?.tolls ?? '',
        parking: item.additionalChargePolicy?.parking ?? '',
        taxes: item.additionalChargePolicy?.taxes ?? '',
        minimumOutstationKmPerDay: item.additionalChargePolicy?.minimumOutstationKmPerDay ?? '',
      },
    }));
  };

  const updateAvailability = async (kind: 'routes' | 'vehicles', id: string, enabled: boolean) => {
    try {
      await api.patch(`/admin/${kind}/${id}`, kind === 'routes'
        ? { status: enabled ? 'active' : 'inactive' }
        : { active: enabled });
      await fetchCatalog();
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to update catalog availability.'));
    }
  };

  const renderForm = () => {
    if (tab === 'overview') {
      return null;
    }

    if (tab === 'drivers') {
      return (
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 rounded-3xl border border-white/10 bg-slate-950/60 p-5 md:grid-cols-2">
          <div>
            <label htmlFor="driver-name" className="mb-2 block text-sm text-slate-200">Name</label>
            <input id="driver-name" value={String(formData.drivers.name)} onChange={(event) => updateFormField('drivers', 'name', event.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white" />
          </div>
          <div>
            <label htmlFor="driver-phone" className="mb-2 block text-sm text-slate-200">Phone</label>
            <input id="driver-phone" value={String(formData.drivers.phone)} onChange={(event) => updateFormField('drivers', 'phone', event.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white" />
          </div>
          <div>
            <label htmlFor="driver-status" className="mb-2 block text-sm text-slate-200">Availability</label>
            <select id="driver-status" value={String(formData.drivers.availabilityStatus)} onChange={(event) => updateFormField('drivers', 'availabilityStatus', event.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white">
              <option value="available">available</option>
              <option value="busy">busy</option>
              <option value="off_duty">off_duty</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm text-slate-200">
              <input type="checkbox" checked={Boolean(formData.drivers.licenseVerified)} onChange={(event) => updateFormField('drivers', 'licenseVerified', event.target.checked)} />
              License verified
            </label>
          </div>
          <div className="md:col-span-2">
            <button type="submit" disabled={isSubmitting} className="primary-button disabled:opacity-60">{isSubmitting ? 'Saving...' : 'Save driver'}</button>
          </div>
        </form>
      );
    }

    if (tab === 'routes') {
      return (
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 rounded-3xl border border-white/10 bg-slate-950/60 p-5 md:grid-cols-2">
          <div>
            <label htmlFor="route-origin" className="mb-2 block text-sm text-slate-200">Origin</label>
            <input id="route-origin" value={String(formData.routes.origin)} onChange={(event) => updateFormField('routes', 'origin', event.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white" />
          </div>
          <div>
            <label htmlFor="route-destination" className="mb-2 block text-sm text-slate-200">Destination</label>
            <input id="route-destination" value={String(formData.routes.destination)} onChange={(event) => updateFormField('routes', 'destination', event.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white" />
          </div>
          <div>
            <label htmlFor="route-type" className="mb-2 block text-sm text-slate-200">Route type</label>
            <select id="route-type" value={String(formData.routes.routeType)} onChange={(event) => updateFormField('routes', 'routeType', event.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white">
              <option value="one_way">one_way</option>
              <option value="round_trip">round_trip</option>
              <option value="local">local</option>
            </select>
          </div>
          <div>
            <label htmlFor="route-status" className="mb-2 block text-sm text-slate-200">Status</label>
            <select id="route-status" value={String(formData.routes.status)} onChange={(event) => updateFormField('routes', 'status', event.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white">
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <button type="submit" disabled={isSubmitting} className="primary-button disabled:opacity-60">{isSubmitting ? 'Saving...' : 'Save route'}</button>
          </div>
        </form>
      );
    }

    if (tab === 'vehicles') {
      return (
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 rounded-3xl border border-white/10 bg-slate-950/60 p-5 md:grid-cols-2">
          <div>
            <label htmlFor="vehicle-category" className="mb-2 block text-sm text-slate-200">Category</label>
            <input id="vehicle-category" value={String(formData.vehicles.category)} onChange={(event) => updateFormField('vehicles', 'category', event.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white" />
          </div>
          <div>
            <label htmlFor="vehicle-pricing-model" className="mb-2 block text-sm text-slate-200">Pricing model</label>
            <select id="vehicle-pricing-model" value={String(formData.vehicles.pricingModel)} onChange={(event) => updateFormField('vehicles', 'pricingModel', event.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white">
              <option value="per_km">per_km</option>
              <option value="fixed_route">fixed_route</option>
              <option value="custom">custom</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="vehicle-description" className="mb-2 block text-sm text-slate-200">Description</label>
            <textarea id="vehicle-description" value={String(formData.vehicles.description)} onChange={(event) => updateFormField('vehicles', 'description', event.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white" rows={3} />
          </div>
          <div>
            <label htmlFor="vehicle-capacity" className="mb-2 block text-sm text-slate-200">Passenger capacity</label>
            <input id="vehicle-capacity" type="number" value={Number(formData.vehicles.passengerCapacity)} onChange={(event) => updateFormField('vehicles', 'passengerCapacity', Number(event.target.value))} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white" />
          </div>
          <div>
            <label htmlFor="vehicle-luggage" className="mb-2 block text-sm text-slate-200">Luggage capacity</label>
            <input id="vehicle-luggage" type="number" value={Number(formData.vehicles.luggageCapacity)} onChange={(event) => updateFormField('vehicles', 'luggageCapacity', Number(event.target.value))} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white" />
          </div>
          <div className="md:col-span-2">
            <button type="submit" disabled={isSubmitting} className="primary-button disabled:opacity-60">{isSubmitting ? 'Saving...' : 'Save vehicle'}</button>
          </div>
        </form>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 rounded-3xl border border-white/10 bg-slate-950/60 p-5 md:grid-cols-2">
        <div>
          <label htmlFor="pricing-name" className="mb-2 block text-sm text-slate-200">Rule name</label>
          <input id="pricing-name" value={String(formData.pricing.name)} onChange={(event) => updateFormField('pricing', 'name', event.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white" />
        </div>
        <div>
          <label htmlFor="pricing-vehicle-category" className="mb-2 block text-sm text-slate-200">Vehicle category</label>
          <input id="pricing-vehicle-category" value={String(formData.pricing.vehicleCategory)} onChange={(event) => updateFormField('pricing', 'vehicleCategory', event.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white" />
        </div>
        <div>
          <label htmlFor="pricing-model" className="mb-2 block text-sm text-slate-200">Pricing model</label>
          <select id="pricing-model" value={String(formData.pricing.pricingModel)} onChange={(event) => updateFormField('pricing', 'pricingModel', event.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white">
            <option value="fixed_route">fixed_route</option>
            <option value="per_km">per_km</option>
            <option value="round_trip">round_trip</option>
            <option value="custom">custom</option>
          </select>
        </div>
        <div>
          <label htmlFor="pricing-base-fare" className="mb-2 block text-sm text-slate-200">Base fare</label>
          <input id="pricing-base-fare" type="number" value={Number(formData.pricing.baseFare)} onChange={(event) => updateFormField('pricing', 'baseFare', Number(event.target.value))} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white" />
        </div>
        <div>
          <label htmlFor="pricing-per-km" className="mb-2 block text-sm text-slate-200">Per km rate</label>
          <input id="pricing-per-km" type="number" value={Number(formData.pricing.perKmRate)} onChange={(event) => updateFormField('pricing', 'perKmRate', Number(event.target.value))} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white" />
        </div>
        <div>
          <label htmlFor="rate-eight-hours" className="mb-2 block text-sm text-slate-200">8 hours / 80 km (INR)</label>
          <input id="rate-eight-hours" type="number" min={0} value={formData.pricing.eightHoursEightyKm} onChange={(event) => updateFormField('pricing', 'eightHoursEightyKm', event.target.value === '' ? '' : Number(event.target.value))} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white" />
        </div>
        <div>
          <label htmlFor="rate-twelve-hours" className="mb-2 block text-sm text-slate-200">12 hours / 120 km (INR)</label>
          <input id="rate-twelve-hours" type="number" min={0} value={formData.pricing.twelveHoursOneTwentyKm} onChange={(event) => updateFormField('pricing', 'twelveHoursOneTwentyKm', event.target.value === '' ? '' : Number(event.target.value))} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white" />
        </div>
        <div>
          <label htmlFor="rate-outstation" className="mb-2 block text-sm text-slate-200">Outstation per km (INR)</label>
          <input id="rate-outstation" type="number" min={0} value={formData.pricing.outstationPerKm} onChange={(event) => updateFormField('pricing', 'outstationPerKm', event.target.value === '' ? '' : Number(event.target.value))} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white" />
        </div>
        <div>
          <label htmlFor="rate-extra-hour" className="mb-2 block text-sm text-slate-200">Extra hour (INR)</label>
          <input id="rate-extra-hour" type="number" min={0} value={formData.pricing.extraHour} onChange={(event) => updateFormField('pricing', 'extraHour', event.target.value === '' ? '' : Number(event.target.value))} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white" />
        </div>
        <div>
          <label htmlFor="rate-extra-km" className="mb-2 block text-sm text-slate-200">Extra km (INR/km)</label>
          <input id="rate-extra-km" type="number" min={0} value={formData.pricing.extraKmPerKm} onChange={(event) => updateFormField('pricing', 'extraKmPerKm', event.target.value === '' ? '' : Number(event.target.value))} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white" />
        </div>
        <div>
          <label htmlFor="rate-min-distance" className="mb-2 block text-sm text-slate-200">Minimum outstation km/day</label>
          <input id="rate-min-distance" type="number" min={0} value={formData.pricing.minimumOutstationKmPerDay} onChange={(event) => updateFormField('pricing', 'minimumOutstationKmPerDay', event.target.value === '' ? '' : Number(event.target.value))} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white" />
        </div>
        {([
          ['tolls', 'Toll policy'],
          ['parking', 'Parking policy'],
          ['taxes', 'Tax policy'],
        ] as const).map(([field, label]) => (
          <div key={field}>
            <label htmlFor={`rate-${field}`} className="mb-2 block text-sm text-slate-200">{label}</label>
            <input id={`rate-${field}`} value={formData.pricing[field]} onChange={(event) => updateFormField('pricing', field, event.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white" />
          </div>
        ))}
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm text-slate-200">
            <input type="checkbox" checked={Boolean(formData.pricing.active)} onChange={(event) => updateFormField('pricing', 'active', event.target.checked)} />
            Active
          </label>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm text-slate-200">
            <input type="checkbox" checked={Boolean(formData.pricing.verified)} onChange={(event) => updateFormField('pricing', 'verified', event.target.checked)} />
            Verified for public display
          </label>
        </div>
        <p className="text-xs text-slate-400 md:col-span-2">Only mark prices and policies as verified after confirming them with the business. Unverified items are not shown to customers.</p>
        <div className="md:col-span-2">
          {editingPricingId && <button type="button" onClick={() => { setEditingPricingId(''); setFormData(DEFAULT_FORM_DATA); }} className="secondary-button mr-3">Cancel edit</button>}
          <button type="submit" disabled={isSubmitting} className="primary-button disabled:opacity-60">{isSubmitting ? 'Saving...' : editingPricingId ? 'Update pricing rule' : 'Save pricing rule'}</button>
        </div>
      </form>
    );
  };

  return (
    <div className="section-shell py-20">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Fleet and pricing</p>
          <h1 className="mt-4 font-display text-4xl font-bold">Operations catalog</h1>
        </div>
        <div className="flex gap-3">
          <Link to="/admin" className="secondary-button">Back to dashboard</Link>
          <button type="button" onClick={() => void fetchCatalog()} className="primary-button">Refresh</button>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              tab === item.key
                ? 'bg-amber text-slate-950'
                : 'border border-white/10 bg-white/5 text-slate-200 hover:border-amber/60'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-slate-300">
          Loading catalog...
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
          {tab === 'overview' && (
            <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
              {activeItems.map((item) => {
                const section = (item as any).section as string;

                if (section === 'driver') {
                  return (
                    <div key={`driver-${(item as DriverItem)._id}`} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-amber">Driver</p>
                      <p className="mt-2 text-lg font-semibold text-white">{(item as DriverItem).name}</p>
                      <p className="mt-2 text-sm text-slate-300">{(item as DriverItem).phone}</p>
                    </div>
                  );
                }

                if (section === 'route') {
                  return (
                    <div key={`route-${(item as RouteItem)._id}`} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-amber">Route</p>
                      <p className="mt-2 text-lg font-semibold text-white">{(item as RouteItem).origin} → {(item as RouteItem).destination}</p>
                      <p className="mt-2 text-sm text-slate-300">{(item as RouteItem).routeType ?? 'one_way'}</p>
                    </div>
                  );
                }

                if (section === 'vehicle') {
                  return (
                    <div key={`vehicle-${(item as VehicleItem)._id}`} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-amber">Vehicle</p>
                      <p className="mt-2 text-lg font-semibold text-white">{(item as VehicleItem).category}</p>
                      <p className="mt-2 text-sm text-slate-300">Capacity: {(item as VehicleItem).passengerCapacity ?? 0}</p>
                    </div>
                  );
                }

                return (
                  <div key={`pricing-${(item as PricingItem)._id}`} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-amber">Pricing</p>
                    <p className="mt-2 text-lg font-semibold text-white">{(item as PricingItem).name}</p>
                    <p className="mt-2 text-sm text-slate-300">₹{(item as PricingItem).baseFare?.toLocaleString() ?? '0'}</p>
                  </div>
                );
              })}
            </div>
          )}

          {tab === 'drivers' && (
            <div>
              <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
                {activeItems.map((item) => (
                  <div key={(item as DriverItem)._id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <p className="text-lg font-semibold text-white">{(item as DriverItem).name}</p>
                    <p className="mt-2 text-sm text-slate-300">{(item as DriverItem).phone}</p>
                    <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
                      <span>{(item as DriverItem).availabilityStatus ?? 'available'}</span>
                      <span>{(item as DriverItem).licenseVerified ? 'Verified' : 'Pending'}</span>
                    </div>
                  </div>
                ))}
              </div>
              {renderForm()}
            </div>
          )}

          {tab === 'routes' && (
            <div>
              <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
                {activeItems.map((item) => (
                  <div key={(item as RouteItem)._id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <p className="text-lg font-semibold text-white">{(item as RouteItem).origin} → {(item as RouteItem).destination}</p>
                    <p className="mt-2 text-sm text-slate-300">{(item as RouteItem).routeType ?? 'one_way'}</p>
                    <p className="mt-4 text-xs uppercase tracking-[0.2em] text-amber">{(item as RouteItem).status ?? 'active'}</p>
                    <button type="button" onClick={() => void updateAvailability('routes', (item as RouteItem)._id, (item as RouteItem).status !== 'active')} className="secondary-button mt-4 w-full">
                      {(item as RouteItem).status === 'active' ? 'Disable route' : 'Enable route'}
                    </button>
                  </div>
                ))}
              </div>
              {renderForm()}
            </div>
          )}

          {tab === 'vehicles' && (
            <div>
              <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
                {activeItems.map((item) => (
                  <div key={(item as VehicleItem)._id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <p className="text-lg font-semibold text-white">{(item as VehicleItem).category}</p>
                    <p className="mt-2 text-sm text-slate-300">Capacity: {(item as VehicleItem).passengerCapacity ?? 0} passengers</p>
                    <p className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-400">Luggage: {(item as VehicleItem).luggageCapacity ?? 0}</p>
                    <button type="button" onClick={() => void updateAvailability('vehicles', (item as VehicleItem)._id, !(item as VehicleItem).active)} className="secondary-button mt-4 w-full">
                      {(item as VehicleItem).active ? 'Disable category' : 'Enable category'}
                    </button>
                  </div>
                ))}
              </div>
              {renderForm()}
            </div>
          )}

          {tab === 'pricing' && (
            <div>
              <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
                {activeItems.map((item) => (
                  <div key={(item as PricingItem)._id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <p className="text-lg font-semibold text-white">{(item as PricingItem).name}</p>
                    <p className="mt-2 text-sm text-slate-300">{(item as PricingItem).pricingModel ?? 'per_km'}</p>
                    <p className="mt-2 text-sm text-slate-300">{(item as PricingItem).vehicleCategory}</p>
                    <p className="mt-4 text-xs uppercase tracking-[0.2em] text-amber">{(item as PricingItem).verified ? 'Verified for public display' : 'Not verified'}</p>
                    <button type="button" onClick={() => editPricing(item as PricingItem)} className="secondary-button mt-4 w-full">Edit rate and policies</button>
                  </div>
                ))}
              </div>
              {renderForm()}
            </div>
          )}

          {activeItems.length === 0 && tab !== 'overview' && (
            <div className="p-8 text-center text-slate-300">No records available in this catalog yet.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminCatalogPage;
